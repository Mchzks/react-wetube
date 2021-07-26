import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");

const Modal = ({children}) => {
    const elref = useRef(null);
    if(!elref.current) {
        elref.current = document.createElement("div");
    }

    useEffect(() => {
        modalRoot.appendChild(elref.current);
        return () => modalRoot.removeChild(elref.current);
    }, []);

    return createPortal(<div>{children}</div>, elref.current);
}

export default Modal;