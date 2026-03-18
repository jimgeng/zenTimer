import CopyIcon from "../../assets/icons/CopyIcon";
import PencilIcon from "../../assets/icons/PencilIcon";
import RefreshIcon from "../../assets/icons/RefreshIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import Button from "../shared/Button";

const BUTTON_SIZE = "sm";

export default function SolveEdit() {
  return (
    <div className="text-base flex gap-12 justify-center hide-on-solve">
      <Button size={BUTTON_SIZE} variant="subtle" icon={PencilIcon} />
      <Button size={BUTTON_SIZE} variant="subtle" icon={RefreshIcon} />
      <Button size={BUTTON_SIZE} variant="subtle" icon={CopyIcon} />
      <Button size={BUTTON_SIZE} variant="subtle" icon={TrashIcon} />
    </div>
  );
}
