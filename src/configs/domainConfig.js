const getDomain = (server = 'staging') => {
  switch (server) {
    case 'dev':
      return '';
    case 'staging':
      return '';
    case 'production':
      return '';
    default:
      return '';
  }
};
export default getDomain;
