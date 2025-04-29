// Import our custom SearchIcon component
import SearchIcon from './SearchIcon';

// Import our custom FaSearch component
import FaSearch from './FaSearch';

// Import all icons from react-icons/fa
import * as ReactIcons from 'react-icons/fa';

// Export our custom components
export { SearchIcon, FaSearch };

// Re-export all other icons from react-icons/fa
export const {
  FaChartBar,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaUserPlus,
  FaHandshake,
  FaMoneyBillWave,
  FaBullseye,
  FaFileAlt,
  FaUpload,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaEye,
  FaEnvelope,
  FaLock,
  FaSave,
  FaTimes,
  FaUser,
  FaBuilding,
  FaPhone,
  FaCalendarAlt,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
  FaInbox,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaRedo,
  FaSpinner,
  FaFileContract,
  FaUsers,
  FaUserFriends,
  FaChartLine,
  FaCog,
  FaHistory,
  FaHome,
  FaLink,
  FaPaperPlane,
  FaQuestion,
  FaStar,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaBars,
  FaBell,
  FaArrowLeft,
  FaArrowRight,
  FaEyeSlash,
  FaSortAmountDown
} = ReactIcons;

// Make FaSearch available globally to fix reference errors
if (typeof window !== 'undefined') {
  window.FaSearch = FaSearch;
}
