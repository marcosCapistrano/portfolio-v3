import { createContext } from 'react';

export type Task = {
    id: number;
    name: "CONNECTION" | "READ";
    pending: boolean;
}

export type State = {
    tasks: Task[] | [];
    serverTasks: Task[] | [];
    ioTasks: Task[] | [];
}

interface TaskAction {
    type: "NORMAL_NEW" | "SERVER_NEW" | "IO_NEW" | "NORMAL_REMOVE" | "SERVER_REMOVE" | "IO_REMOVE";
    id: number;
}

export const Context = createContext<State>({ tasks: [], serverTasks: [], ioTasks: [] })
export const DispatchContext = createContext(null);

export function tasksReducer(state: State, action: TaskAction) {
    switch (action.type) {
        case 'NORMAL_NEW': {
            console.log("normal new");

            // Create a new state object by copying the old state
            const newState = { ...state };

            // Create a new array for tasks by copying the old array and adding the new task
            newState.tasks = [...state.tasks, {
                id: action.id,
                name: "CONNECTION",
                pending: false,
            }];

            return newState;
        }

        case 'SERVER_NEW': {
            console.log("server new");

            // Find the task to move from tasks to serverTasks
            const taskToMove = state.tasks.find(task => task.id === action.id);

            if (!taskToMove) {
                // Task not found, return the current state
                return state;
            }

            // Create a new state object by copying the old state
            const newState = { ...state };

            // Remove the task from tasks and add it to serverTasks
            newState.serverTasks = [...newState.serverTasks, taskToMove];

            // Update the pending property of the task being moved
            newState.serverTasks = newState.serverTasks.map(task => {
                if (task.id === action.id) {
                    return { ...task, pending: true };
                }
                return task;
            });

            return newState;
        }

        case 'IO_NEW': {

            // Find the task to move from tasks to serverTasks
            const taskToMove = state.serverTasks.find(task => task.id === action.id);

            if (!taskToMove) {
                // Task not found, return the current state
                return state;
            }

            // Create a new state object by copying the old state
            const newState = { ...state };

            // Remove the task from tasks and add it to serverTasks
            newState.ioTasks = [...newState.ioTasks, taskToMove];
            newState.serverTasks = newState.serverTasks.filter(task => task.id !== action.id);

            // Update the pending property of the task being moved
            newState.ioTasks = newState.ioTasks.map(task => {
                if (task.id === action.id) {
                    return { ...task, pending: true };
                }
                return task;
            });

            return newState;
        }
        case 'NORMAL_REMOVE': {
            console.log("normal remove");

            // Create a new state object by copying the old state
            const newState = { ...state };

            // Remove the task with the specified id from tasks
            newState.tasks = newState.tasks.filter(task => task.id !== action.id);

            return newState;
        }

        case 'SERVER_REMOVE': {
            console.log("server remove");

            // Create a new state object by copying the old state
            const newState = { ...state };

            // Remove the task with the specified id from serverTasks
            newState.serverTasks = newState.serverTasks.filter(task => task.id !== action.id);

            return newState;
        }

        case 'IO_REMOVE': {
            console.log("io remove");

            // Create a new state object by copying the old state
            const newState = { ...state };

            // Remove the task with the specified id from ioTasks
            newState.ioTasks = newState.ioTasks.filter(task => task.id !== action.id);

            return newState;
        }


        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}