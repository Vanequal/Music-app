
import React from "react";
import styles from "../../UI/Modal.module.scss";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
