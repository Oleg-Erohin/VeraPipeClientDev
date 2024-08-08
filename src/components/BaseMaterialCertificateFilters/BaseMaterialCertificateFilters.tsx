import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../models/IBaseMaterialCertificate";
import { IBaseMaterialType } from "../../models/IBaseMaterialType";
import Modal from "react-modal";
import { Notifications } from "../../enums/Notificatios";
import NotificationWindow from "../NotificationWindow/NotificationWindow";
import { IFile } from "../../models/IFile";
import { FileType } from "../../enums/FileType";
import FileEditor, {IFileEditorPublicMethods} from "../FileEditor/FileEditor";

interface BaseMaterialCertificateFiltersProps {
  baseMaterialCertificates: IBaseMaterialCertificate[];
}

function BaseMaterialCertificateEditor(props: BaseMaterialCertificateFiltersProps) {
  Modal.setAppElement("#root");

  return (
    <div className="BaseMaterialCertificateFilters">
      test
    </div>
  );
}

export default BaseMaterialCertificateEditor;