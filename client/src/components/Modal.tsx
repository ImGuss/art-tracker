import { useEffect, useRef } from 'react'

import { X } from 'lucide-react'

import './Modal.css'


interface ModalProps {
  isOpen: boolean;
  onClose(): void;
  title: string;
  children: React.ReactNode;
}

const Modal = (props: ModalProps) => {
  const { isOpen, onClose, title, children } = props

  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }
    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
    
    function handleClose() {
      onClose()
    }

    dialog.addEventListener('close', handleClose)

    return () => {
      dialog.removeEventListener('close', handleClose)
    }
  }, [isOpen, onClose])

  function clickOut(e:React.MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <dialog
      className="modal"
      onClick={clickOut}
      ref={dialogRef}
    >
      <div className="modal-container">
        <div className="modal-header">
          <h1>{title}</h1>
          <button
            className="modal-x-btn"
            onClick={onClose}
          >
            <X className="gold-link" />
         </button>
        </div>
        
        <div className="modal-children">
          {children}
        </div>
      </div>
    </dialog>
  )
}

export default Modal