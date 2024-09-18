import React from 'react';

import { Modal, Paper } from '@mui/material';

/**
 * @param {{
 *  open: boolean,
 *  onClose: (...args: any) => void,
 *  children: React.ReactNode
 * }} param0
 */
export default function PopupBase({ open, onClose, children }) {
    return <>
        <Modal
            open={open}
            onClose={(...args) => onClose.apply(undefined, args)}
        >
            {open && <Paper sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '75%',
                height: '75%',
                boxShadow: 24,
                p: 3,
                pb: 2,
                display: 'flex',
                flexDirection: 'column',
            }}>
                {children}
            </Paper> || <></>}
        </Modal>
    </>
}