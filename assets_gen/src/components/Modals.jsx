import React from 'react';

import { useSelector } from '../utils';
import { selectPopup } from '../store';

import EditTask from './popup/EditTask';
import UploadTask from './popup/UploadTask';
import Download from './popup/Download';

export default function Modals() {
    const popup = useSelector(selectPopup);
    
    return <>
        <EditTask   key={popup.EditTask.id} />
        <UploadTask key={popup.UploadTask.open.toString()} />
        <Download   key={popup.DonwloadTask.text} />
    </>;
}