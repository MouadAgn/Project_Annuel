import './Modal.css';
import PropTypes from 'prop-types';


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Define prop type as boolean and required
    onClose: PropTypes.func.isRequired, // Define prop type as function and required
    children: PropTypes.node.isRequired, // Define prop type as any React node (element or string) and required
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
