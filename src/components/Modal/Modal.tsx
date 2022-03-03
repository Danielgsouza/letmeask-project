import ReactModal, { Props } from "react-modal";

interface ModalProps extends Props {
  isOpen: boolean;
  setIsOpen: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, setIsOpen, children }: ModalProps): JSX.Element {
  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={isOpen}
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#f8f8f8",
          width: "90%",
          maxWidth: "31.25rem",
          minWidth: "21.875rem",
        },
        overlay: {
          backgroundColor: "rgb(6, 3, 8, 0.8)",
        },
      }}
    >
      {children}
    </ReactModal>
  );
}

export { Modal };
