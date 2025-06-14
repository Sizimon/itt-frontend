'use client';

import React, { useState, useRef, useEffect } from 'react';

import Layout from '../Layout';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import SortAndTagsMenu from '../components/SearchAndFilter/SortAndTagsMenu';
import SearchAndCreate from '../components/SearchAndFilter/SearchAndCreate';
import TaskGrid from '../components/TaskInterface/TaskGrid';
import CreateTaskModal from '../components/CreateTaskModal';

import { useRouter } from 'next/navigation';
import { useTasks } from '../context/TasksProvider';
import { useAuth } from '../context/AuthProvider';
import { useOnClickOutside } from '../hooks/onClickOutside';



const UserDashboard: React.FC = () => {
    const { allTasks, refreshTasks } = useTasks();
    const { user } = useAuth();
    const router = useRouter();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [filteredTasks, setFilteredTasks] = useState<any[]>(allTasks); // This will be updated based on search or filter criteria
    const [tagsMenuOpen, setTagsMenuOpen] = useState<boolean>(false);
    const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<string>('alphabetical');
    const [creatingTagForId, setCreatingTagForId] = useState<string | null>(null);
    const [newTag, setNewTag] = useState<string>('');

    const tagsRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(tagsRef, () => setTagsMenuOpen(false));
    const sortRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(sortRef, () => setSortMenuOpen(false));

    const handleCreateTag = (taskId: string) => {
        // Create API call to create a new tag for the task !!! IMPORTANT !!!
        console.log(`Create tag "${newTag}" for task ID: ${taskId}`);
        setNewTag(''); // Reset the new tag input
        setCreatingTagForId(null); // Close the tag creation input

    }

    const handleTagsMenuToggle = () => {
        setTagsMenuOpen(!tagsMenuOpen);
    }

    const handleSortMenuToggle = () => {
        setSortMenuOpen(!sortMenuOpen);
    }

    const handleTaskClick = (card: any) => {
        const userStorage = localStorage.getItem('user');
        let user = userStorage ? JSON.parse(userStorage) : null;

        if (user) {
            if (!Array.isArray(user.lastViewed)) user.lastViewed = [];

            user.lastViewed = user.lastViewed.filter((id: string) => id !== card.id); // Remove the task if it already exists
            user.lastViewed.unshift(card.id); // Add the task to the front of the array
            if (user.lastViewed.length > 10) user.lastViewed.pop(); // Limit to the last 10 viewed tasks
            localStorage.setItem('user', JSON.stringify(user)); // Update the user in local storage
        }
        
        router.push(`/tasks/${card.id}`);
    }

    const handleSearchChange = (value: string) => {
        // Implement search functionality here
        const filteredResult = allTasks.filter(task => task.title.toLowerCase().includes(value.toLowerCase()));
        setFilteredTasks(filteredResult);
    }

    const sortTasks = (tasks: any[], order: string) => {
        switch (order) {
            case 'alphabetical':
                return tasks.sort((a, b) => a.title.localeCompare(b.title));
            case 'date':
                return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'favorite':
                return tasks.filter(task => task.isFavorite);
            default:
                return tasks; // If no valid order is specified, return the tasks as is
        }
    }

    useEffect(() => {
        // Whenever allTasks or sortOrder changes, we re-filter and sort the tasks
        const sortedTasks = sortTasks([...allTasks], sortOrder);
        setFilteredTasks(sortedTasks ?? []);
    }, [allTasks, sortOrder]);

    console.log('All Tasks:', allTasks);

    return (
        <Layout>
            <div className="
                flex flex-col w-full text-zinc-800 items-center justify-center min-h-screen bg-white py-12
                dark:text-white dark:bg-zinc-900
            ">
                <DashboardHeader user={user} />
                <div className='
                    bg-zinc-100 w-11/12 p-4 rounded-lg
                    dark:bg-zinc-950
                    md:w-10/12
                '>
                    {allTasks.length > 0 ? (
                        /* This will be a for loop to display every user created task */
                        <div className='flex flex-col items-center'>
                            <div className="flex flex-col items-center justify-center w-full mb-4 md:flex-row md:gap-4">
                                <SearchAndCreate
                                    handleModalOpen={() => setShowModal(true)}
                                    handleSearchChange={handleSearchChange}
                                />
                                <SortAndTagsMenu
                                    sortMenuOpen={sortMenuOpen}
                                    handleSortMenuToggle={handleSortMenuToggle}
                                    sortOrder={sortOrder}
                                    setSortOrder={setSortOrder}
                                    sortRef={sortRef}
                                    tagsMenuOpen={tagsMenuOpen}
                                    handleTagsMenuToggle={handleTagsMenuToggle}
                                    tagsRef={tagsRef}
                                />
                            </div>
                            <TaskGrid
                                filteredTasks={filteredTasks}
                                creatingTagForId={creatingTagForId}
                                setCreatingTagForId={setCreatingTagForId}
                                newTag={newTag}
                                setNewTag={setNewTag}
                                handleCreateTag={handleCreateTag}
                                handleTaskClick={handleTaskClick}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl mb-4">Let's create your first task!</h2>
                            <button
                                className='space-y-2 p-4 mb-8 w-1/4 text-white bg-amber-600 rounded cursor-pointer transition-all duration-300 hover:bg-amber-500'
                                onClick={() => setShowModal(true)}
                            >
                                Create new Task
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showModal && (
                <CreateTaskModal
                    handleModalClose={() => {
                        setShowModal(false);
                        refreshTasks(); // Refresh tasks after creating a new task
                    }}
                />
            )}
        </Layout>
    );
}

export default UserDashboard;