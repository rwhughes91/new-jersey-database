const UploadLienData = {
  sale_date: ({ sale_date }) => {
    return sale_date.toLocaleDateString();
  },
  recording_date: ({ recording_date }) => {
    return recording_date.toLocaleDateString();
  },
};

export default UploadLienData;
