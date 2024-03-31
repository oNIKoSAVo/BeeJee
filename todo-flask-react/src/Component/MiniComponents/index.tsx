import React from "react"
import { Modal } from "./Modal/ModalPopup"

interface LSModalProps {
    title: string,
    width?: number | string,
    onHide?: any,
    children: any,
    footer?: any
    style?: React.CSSProperties,
    fullscreen?: boolean,
}

interface SimpleModalProps extends LSModalProps {
    
}

export default function SimpleModal({
    title,
    ...props
}: SimpleModalProps) {
    const {
        onHide, footer, children, ...rest
    } = props
    return (
        <Modal
            title={title}
            visible={true}
            allowClose
            closeOnClickOutside
            width={props.style?.width || props.width || "50%"}
            onHide={() => onHide?.()}
            footer={footer}
            {...rest}
        >{children}</Modal>
    )
}