import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';

const PIPELINE_STAGES = {
  NEW_LEADS: 'New Leads',
  DISCOVERY: 'Discovery',
  PROPOSAL: 'Proposal Sent',
  NEGOTIATIONS: 'Negotiations',
  CLOSED_LOST: 'Closed Lost',
  CLOSED_WON: 'Closed Won'
};

const PipelineView = () => {
  const [leads, setLeads] = useState({});
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const leadsQuery = query(collection(db, 'leads'));
      const snapshot = await getDocs(leadsQuery);
      
      const organizedLeads = Object.keys(PIPELINE_STAGES).reduce((acc, stage) => {
        acc[stage] = [];
        return acc;
      }, {});

      snapshot.docs.forEach(doc => {
        const lead = { id: doc.id, ...doc.data() };
        organizedLeads[lead.stage].push(lead);
      });

      setLeads(organizedLeads);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      // Optimistic update
      const newLeads = { ...leads };
      const [movedLead] = newLeads[source.droppableId].splice(source.index, 1);
      newLeads[destination.droppableId].splice(destination.index, 0, {
        ...movedLead,
        stage: destination.droppableId
      });
      setLeads(newLeads);
      setDraggedLead({ id: draggableId, stage: destination.droppableId });

      // Update Firestore
      await updateDoc(doc(db, 'leads', draggableId), {
        stage: destination.droppableId,
        lastUpdated: serverTimestamp()
      });

      setDraggedLead(null);
    } catch (error) {
      console.error('Error updating lead stage:', error);
      // Revert on error
      fetchLeads();
      setDraggedLead(null);
    }
  };

  if (loading) return <div>Loading pipeline...</div>;

  return (
    <div className="pipeline-view">
      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="pipeline-container">
            {Object.entries(PIPELINE_STAGES).map(([stageKey, stageTitle]) => (
              <Droppable droppableId={stageKey} key={stageKey}>
                {(provided) => (
                  <div
                    className="pipeline-stage"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3 className="stage-title">
                      {stageTitle}
                      <span className="lead-count">{leads[stageKey].length}</span>
                    </h3>
                    {leads[stageKey].map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="lead-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h4>{lead.companyName}</h4>
                            <p>{lead.contactName}</p>
                            <p className="deal-value">${lead.dealValue?.toLocaleString()}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default PipelineView; 