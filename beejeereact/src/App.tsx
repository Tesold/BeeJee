import React, { useEffect, useRef, useState } from 'react';
import { createTask, getListOfTasksReq, getPagesReq, LogIn, LogOut, Refresh } from './req/req';
import { TodoList } from './Todo/TodoList';
import styles from './App.module.css';
import {RootState} from './redux/store'
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN, LOG_OUT, SET_TODO_ARR } from './redux/slice';

function App() {

  const [pages, setPages] = useState(0);
  const [pagesButtons, setPagesButtons] = useState(Array);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderType, setOrderType] = useState("ASC");
  const [orderField, setOrderField] = useState("ID")
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [UserName, setUserName]=useState();
  const [Email, setEmail]=useState();
  const [Text, setText]=useState();

  const logIn = useSelector((state: RootState) => state.login.isLOG_IN);
  const arr = useSelector((state: RootState) => state.login.todoArr);
  const update = useSelector((state: RootState) => state.login.update);
  const dispatch = useDispatch()

  let refNickname = useRef();
  let refPassword = useRef();

  function callbackTasks(){
    getListOfTasksReq(currentPage, orderType, orderField)
    .then(
      (res:any)=>{
      dispatch(SET_TODO_ARR(res));}
    );
  }

  function callbackPages()
  {
    getPagesReq()
      .then((res:any)=>{
        setPages(res);
      });
  }

  useEffect(()=>{TryLogIn()}, [])

  useEffect(()=>{
    
      callbackTasks();

      callbackPages();
      
    }, [update]);

  useEffect(()=>{setPagesButtonsF()}, [pages])

  useEffect(()=>{
    callbackTasks();
  }, [orderField, orderType, currentPage])


  const addTask = async () =>{

    let response:any;

    if(UserName&&Email&&Text)
    {
    try{
          response=await createTask(UserName, Email, Text);
          if(response.status==201)
          {
          alert("Задача создана!")
            callbackPages();
            callbackTasks();
        }
        }
        catch{alert("Проверьте Email")}
    }
    else{
      alert("Заполните все поля!")
    }


  }

  async function setPagesButtonsF(){

    let arr= [];

    for(let i=1; i<=pages; i++)
    arr.push(PageItem(i))

    setPagesButtons(arr);
  }

  function PageItem(n:any){
    return (<button onClick={()=>{
      setCurrentPage(n)
    }} style={{backgroundColor: (currentPage==n)?'lightgrey':'lightgrey'}}>{n}</button>)
  }

  function Pages(){
    return(
      <div className={styles.pages}>
        {pagesButtons.map((element:any)=>element)}
      </div>
    )
  }

  function Head(){
    return logIn?
    <div style={{width: '100%', alignItems: 'center',backgroundColor: 'tomato',flexDirection: 'column', marginBottom: 50, marginTop: 10, display: 'flex'}}>
      <div>Admin</div>
      <button onClick={Logout}>Выйти</button>
    </div>
    :!modalOpen?
    <div style={{flexDirection: 'column',
    display: 'flex',
     marginBottom: 15,
      marginTop: 10,
       backgroundColor: 'tomato',
        width: '100%',
        height: 50,
         justifyContent: 'center',
          alignItems: 'center'}}>
      <button onClick={()=>setModalOpen(true)}>Войти</button>
    </div>
    :
    <Modal/>
  }

  async function TryLogIn(){
    try{
      const refr = await Refresh()
      if(refr===201)
      {
        dispatch(LOG_IN());
      }
      else{
        const login = await LogIn(refNickname+'', refPassword+'');
        if(login===201)
        dispatch(LOG_IN());
      }
    }
    catch
    {
      const login = await LogIn(refNickname+'', refPassword+"");
      if(login===201)
      dispatch(LOG_IN());
    }
  }

  function Logout() {
    try{
    LogOut();
    dispatch(LOG_OUT())
    }
    catch{alert("Не удалось выйти");
    }
  }

  function Modal(){
    return (<div style={{display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center', 
    width: '100%', 
    height: 150, 
    backgroundColor: 'tomato',
    flexDirection: 'column',
    marginBottom: 20}}>
      <div>
      <div>Логин</div>
      <input
        type="text" 
        value={refNickname.current}
        onChange={(e:any)=>refNickname=e.target.value}
      ></input>
      </div>
      <div>
      <div>Пароль</div>
      <input
        type='password' 
        value={refPassword.current}
        onChange={(e:any)=>refPassword=e.target.value}
      ></input>
      </div>
      <button onClick={()=>TryLogIn()}>Войти</button>
    </div>)
  }

  return (
    <div className={styles.container}>
      <Head/>
      <TodoList todos={arr}/>
      <button style={{marginBottom: 20, marginTop: 10}} onClick={()=>setIsAdd(true)}>Добавить</button>
      {isAdd?<div style={{backgroundColor: 'lightgrey', width: 500, flexDirection: 'column', marginBottom: 15, display:'flex'}} className={styles.ItemContainer}>
            <div style={{flexDirection: 'column', display:'flex'}}>
                <input onBlur={(e:any)=>setUserName(e.target.value)} required placeholder='Логин' type={'email'}></input>
                <input onBlur={(e:any)=>setEmail(e.target.value)} required placeholder='Email'></input>
            </div>
            <div style={{display: 'flex', width: '100%'}}>
                <textarea onBlur={(e:any)=>setText(e.target.value)} placeholder='Задача' style={{width: '100%', resize: 'none', marginLeft: 'auto', marginRight: 'auto'}}></textarea>
            </div>
            <button onClick={addTask}>Отправить</button>
        </div>:null}
      <Pages/>
      <div>
        <button onClick={()=>{setOrderType('ASC'); setOrderField('UserName')}} style={{marginBottom: 20, marginTop: 10}}>По имени по возрастанию</button>
        <button onClick={()=>{setOrderType('ASC'); setOrderField('Email')}} style={{marginBottom: 20, marginTop: 10}}>По почте по возрастанию</button>
        <button onClick={()=>{setOrderType('ASC'); setOrderField('Status')}} style={{marginBottom: 20, marginTop: 10}}>По статусу по возрастанию</button>
      </div>
      <div>
        <button onClick={()=>{setOrderType('DESC'); setOrderField('UserName')}} style={{marginBottom: 20, marginTop: 10}}>По имени по убыванию</button>
        <button onClick={()=>{setOrderType('DESC'); setOrderField('Email')}} style={{marginBottom: 20, marginTop: 10}}>По почте по убыванию</button>
        <button onClick={()=>{setOrderType('DESC'); setOrderField('Status')}} style={{marginBottom: 20, marginTop: 10}}>По статусу по убыванию</button>
      </div>
    </div>
  );
}





export default App;
