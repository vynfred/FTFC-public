import { Helmet } from 'react-helmet';

const SEOHelmet = ({ title, description, image, url }) => (
  <Helmet>
    <title>{title} | FTFC</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta name="twitter:card" content="summary_large_image" />
  </Helmet>
); 