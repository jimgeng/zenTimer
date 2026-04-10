import { useMemo, useState } from "react";
import { useSessionStore } from "../../store/useSessionStore";
import Button from "../shared/Button";
import CloseIcon from "../../assets/icons/CloseIcon";
import AddIcon from "../../assets/icons/AddIcon";
import SessionListRow from "./SessionListRow";

export default function SessionManager() {
  const sessionsById = useSessionStore((state) => state.sessionsById);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const switchSession = useSessionStore((state) => state.switchSession);
  const createSession = useSessionStore((state) => state.createSession);
  const renameSession = useSessionStore((state) => state.renameSession);
  const deleteSession = useSessionStore((state) => state.deleteSession);

  const [isOpen, setIsOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const sessions = useMemo(
    () =>
      Object.values(sessionsById).sort(
        (a, b) => (a.creationTime ?? 0) - (b.creationTime ?? 0),
      ),
    [sessionsById],
  );

  const activeSessionName = useMemo(() => {
    if (activeSessionId === null) return "No Session";
    return (
      sessions.find((session) => session.id === activeSessionId)?.name ??
      "No Session"
    );
  }, [activeSessionId, sessions]);

  const beginRename = (id: string, name: string) => {
    setEditingSessionId(id);
    setEditingName(name);
  };

  const saveRename = () => {
    if (!editingSessionId) return;
    renameSession(editingSessionId, editingName);
    setEditingSessionId(null);
    setEditingName("");
  };

  const onDeleteSession = (id: string) => {
    deleteSession(id);
  };

  const onCreateSession = () => {
    createSession();
  };

  return (
    <>
      <Button
        size="sm"
        variant="subtle"
        text={activeSessionName}
        onClick={() => setIsOpen(true)}
        className="max-w-72"
      />

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-bg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl">Sessions</h2>
              <div className="flex gap-4">
                <Button
                  size="sm"
                  variant="standout"
                  icon={AddIcon}
                  text="New Session"
                  iconSide="right"
                  onClick={onCreateSession}
                />
                <Button
                  size="sm"
                  variant="standout"
                  icon={CloseIcon}
                  onClick={() => {
                    setEditingSessionId(null);
                    setEditingName("");
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
            <div className="max-h-[55svh] flex flex-col gap-2 overflow-y-auto">
              {sessions.map((session) => {
                const isActive = session.id === activeSessionId;
                const isEditing = editingSessionId === session.id;

                return (
                  <SessionListRow
                    key={session.id}
                    session={session}
                    isActive={isActive}
                    isEditing={isEditing}
                    editingName={editingName}
                    sessionsCount={sessions.length}
                    onSwitchSession={switchSession}
                    onBeginRename={beginRename}
                    onDeleteSession={onDeleteSession}
                    onEditingNameChange={setEditingName}
                    onSaveRename={saveRename}
                    onCancelRename={() => {
                      setEditingSessionId(null);
                      setEditingName("");
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
