import axios from 'axios';

const CertificateApi = ({params, token, cbSuccess, cbFailure}) => {
  axios.get('https://omvp.studyum.io/v1/certificate');
};

export default CertificateApi;
