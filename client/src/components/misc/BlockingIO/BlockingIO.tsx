import React, { useEffect, useState, type Dispatch, type SetStateAction, useContext, useReducer } from 'react'
import { Context, DispatchContext, tasksReducer } from './Context';
import styles from './BlockingIO.module.css';


let id = 0;
const BlockingIO = () => {
  const [state, dispatch] = useReducer(tasksReducer, { tasks: [], serverTasks: [], ioTasks: [] });

  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <div className={styles.container}>
          <Tasks />
          <Server />
          <IO />
        </div>
        <button onClick={() => {
          console.log("OIEE")
          const data = dispatch({ id: ++id, type: "NORMAL_NEW" });
        }}>Add Task</button>
      </DispatchContext.Provider>
    </Context.Provider>
  )
}

const Tasks = () => {
  const state = useContext(Context);

  console.log(state)
  return (
    <div className={styles.entity}>
      <span className={styles.title}>Tarefas</span>

      <div className={styles.flex}>
        {state.tasks.map(({ id, pending, name }) => (
          <span key={id} className={`${pending && styles.active} no-space`}>{name} {id}</span>
        ))}
      </div>
    </div>
  )
}

const Server = () => {
  const state = useContext(Context);
  const { tasks, serverTasks } = state;
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (tasks.length > 0) {
      if (serverTasks.length === 0) {
        dispatch({ type: "SERVER_NEW", id: tasks[0].id })
      }
    }
  }, [state])

  return (
    <div className={styles.entity}>
      <span>Server</span>
      <div>
        <span>{serverTasks?.map(task => {
          return <span>{task.name} {task.id}</span>
        })}</span>
      </div>
    </div>
  )
}

const IO = () => {
  const state = useContext(Context);
  const { serverTasks, ioTasks } = state;
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (serverTasks.length > 0) {
      if (ioTasks.length === 0) {
        dispatch({ type: "IO_NEW", id: serverTasks[0].id })

        setTimeout(() => {
          dispatch({
            type: "IO_REMOVE", id: serverTasks[0].id
          })

          dispatch({
            type: "SERVER_REMOVE", id: serverTasks[0].id
          })

          dispatch({
            type: "NORMAL_REMOVE", id: serverTasks[0].id
          })
        }, 5000)
      }
    }
  }, [state])

  return (
    <div className={styles.entity}>
      <span>IO</span>
      <div className={styles.flex}>
        {ioTasks?.map(task => {
          return <span>Processando...</span>
        })}
      </div>
    </div>
  )
}

export default BlockingIO