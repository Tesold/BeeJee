import React, {
     useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DONE_TODO } from "../redux/slice";
import { RootState } from "../redux/store";
import { doneTask, editTask } from "../req/req";
import styles from "./Todo.module.css";

export function TodoItem({todo, key, index, callback}:any)
{
    const logIn = useSelector((state: RootState) => state.login.isLOG_IN);
    const [Text, setText] = useState(todo.Text);
    const dispatch = useDispatch();
    
    async function Edit(){

        const response = await editTask(Text, todo.ID);

        if(response.status==201)
        alert("обновлено!")

    }

    return(
        <div style={{backgroundColor: todo.Status?'lightgreen':'white'}} className={styles.ItemContainer}>
            <div className={styles.dataItem}>
                <div className={styles.userNameItemText}>{todo.UserName}</div>
                <div className={styles.emailItemText}>{todo.Email}</div>
            </div>
            <div className={styles.dataItem}>
                <textarea onBlur={(e:any)=>setText(e.target.value)} readOnly={!logIn} className={styles.textAreaItem}>{todo.Text}</textarea>
            </div>
            <div style={{display:'flex', flexDirection:'row', justifyContent: 'space-around', marginTop: 15, marginBottom: 15}}>
            {logIn?<button onClick={()=>{doneTask(todo.ID);dispatch(DONE_TODO(index))}}>Выполнить</button>:null}
            <div>Edited:{todo.Edited+''}</div>
            {logIn?<button onClick={Edit}>Редактировать</button>:null}
            </div>
        </div>
    )
}