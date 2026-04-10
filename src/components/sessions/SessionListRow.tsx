import PencilIcon from "../../assets/icons/PencilIcon";
import SaveIcon from "../../assets/icons/SaveIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import type { Session } from "../../models/sessions";
import Button from "../shared/Button";

interface SessionListRowProps {
  session: Session;
  isActive: boolean;
  isEditing: boolean;
  editingName: string;
  sessionsCount: number;
  onSwitchSession: (id: string) => void;
  onBeginRename: (id: string, name: string) => void;
  onDeleteSession: (id: string) => void;
  onEditingNameChange: (name: string) => void;
  onSaveRename: () => void;
  onCancelRename: () => void;
}

export default function SessionListRow({
  session,
  isActive,
  isEditing,
  editingName,
  sessionsCount,
  onSwitchSession,
  onBeginRename,
  onDeleteSession,
  onEditingNameChange,
  onSaveRename,
  onCancelRename,
}: SessionListRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-md bg-sub-bg p-2 hover:bg-black transition-colors">
      <button
        className="truncate rounded-sm px-2 py-2 cursor-pointer text-left"
        onClick={() => onSwitchSession(session.id)}
      >
        <span className={isActive ? "text-main" : "text-text"}>
          {session.name}
        </span>
        <span className="ml-2 text-xs text-sub">({session.solves.length})</span>
      </button>

      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <input
              className="w-40 rounded-sm border border-bg bg-sub-bg px-2 py-1 text-sm outline-none focus-visible:border-sub"
              value={editingName}
              onChange={(e) => onEditingNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Space") e.stopPropagation();
                if (e.key === "Enter") onSaveRename();
                if (e.key === "Escape") onCancelRename();
              }}
              autoFocus
            />
            <Button
              size="sm"
              variant="subtle"
              icon={SaveIcon}
              onClick={onSaveRename}
            />
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="subtle"
              icon={PencilIcon}
              onClick={() => onBeginRename(session.id, session.name)}
              aria-label={`Rename ${session.name}`}
            />
            <Button
              size="sm"
              variant="subtle"
              icon={TrashIcon}
              onClick={() => onDeleteSession(session.id)}
              aria-label={`Delete ${session.name}`}
              disabled={sessionsCount <= 1}
            />
          </>
        )}
      </div>
    </div>
  );
}
