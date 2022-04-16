class PortsAlreadyInUseError extends Error {
  constructor(portByServiceName) {
    super();
    const statusText = portByServiceName.map((s) => `${s.serviceName}(${s.port})`).join(' ');
    this.message = `!!! Ports already in use: ${statusText}`;
    Error.captureStackTrace(this);
  }
}

PortsAlreadyInUseError.prototype.name = 'PortsAlreadyInUseError';

export default PortsAlreadyInUseError;
