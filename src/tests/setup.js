export default function () {
  this.props = { statusCode: null, message: null };
  this.status = (statusCode) => {
    this.props.statusCode = statusCode;
    return {
      json: (message) => {
        this.props.message = message;
        return this.props;
      },
    };
  };
}
