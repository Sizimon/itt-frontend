import TaskCard from './TaskCard';

export default function TaskGrid({
    filteredTasks,
    noteMenuOpen,
    setNoteMenuOpen,
    noteMenuRef,

    // Handler Functions
    handleNoteMenuToggle,
    handleCreateTag,
    handleRemoveTag,
    handleTaskClick,
    handleFavoriteToggle
}: any) {
    return (
        <div className='grid grid-flow-row justify-items-center w-full'>
            {filteredTasks.length > 0 ? (
                filteredTasks.map((card: any, index: number) => (
                    <TaskCard
                        key={card.id || index}
                        card={card}
                        noteMenuOpen={noteMenuOpen}
                        setNoteMenuOpen={setNoteMenuOpen}
                        noteMenuRef={noteMenuRef}

                        // Handlers
                        handleNoteMenuToggle={handleNoteMenuToggle}
                        handleCreateTag={handleCreateTag}
                        handleRemoveTag={handleRemoveTag}
                        handleTaskClick={handleTaskClick}
                        handleFavoriteToggle={handleFavoriteToggle}
                    />
                ))
            ) : (
                <p className='text-gray-500 col-span-5 py-8'>No tasks found.</p>
            )}
        </div>
    );
}