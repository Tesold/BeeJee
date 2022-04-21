import axios from "axios";
import { getAccessToken, getRefreshToken, getUser, setAccessToken, setRefreshToken, setUser } from "../store/store";

const axiosInstance = axios.create({ 
    baseURL: 'http://188.225.56.228/',
});


export async function getListOfTasksReq(page:number, order:string, orderfield: string)
{
    const response = await axiosInstance.post(``, {
        page,
        order,
        orderfield
    })

    return response.data;
}

export async function getPagesReq()
{
    const response = await axiosInstance.get(`/tasks/pages`)

    return response.data;
}

export async function addTaskReq(UserName:string, Email:string, Text:string)
{
    const response = await axiosInstance.post(`/tasks/create`, {
        UserName,
        Email,
        Text
    })

    return response.data;
}

export async function LogIn(Nickname: string, Password: string) {
    const response = await axiosInstance.post(`/auth/login`,
    {
        username: Nickname,
        password: Password
    });

    setAccessToken(response.data.access_token);
    setRefreshToken(response.data.refresh_token);
    setUser(response.data.payload.Nickname);

    return response.status;
}

export async function Refresh() {

    try{
        const refresh = getRefreshToken();
        const user = getUser();

        const response = await axiosInstance.post(`/auth/refresh`,
        {
            Nickname: user,
            refresh_token: refresh
        });

        if(response.data.refresh_token)
        setRefreshToken(response.data.refresh_token);

        if(response.data.access_token)
        setAccessToken(response.data.access_token);
    
        return response.data.status;
    }
    catch {return 401}
}

export async function LogOut() {
    try{
        LogOutReq();
        setAccessToken('');
        setRefreshToken('');
        setUser('');
    }
    catch{
        Refresh().then(()=>LogOutReq())
        setAccessToken('');
        setRefreshToken('');
        setUser('');
    }
}

export async function LogOutReq() {
    const response = await axiosInstance.post(`/auth/logout`,
    {
        Nickname: getUser(),
    },
    {
        headers:{
            'Authorization': "Bearer "+getAccessToken(),
        }
    });

    setAccessToken('');
    setRefreshToken('');
    setUser('');

    return response.status;
}

export async function doneTask(task:number)
{
    let response:any;
    if(task)
    response = await axiosInstance.get(`/tasks/done/${task}`,
    {
        headers:{
            'Authorization': "Bearer "+getAccessToken(),
        }
    })

    return response.data;
}

export async function createTask(UserName:string, Email:string, Text: string)
{
    const response = await axiosInstance.post(`/tasks/create/`,
    {
        UserName,
        Email,
        Text
    },
    {
        headers:{
            'Authorization': "Bearer "+getAccessToken(),
        }
    })

    return response;
}

export async function editTask(Text: string, ID:string)
{
    const response = await axiosInstance.post(`/tasks/edit/`,
    {
        Text,
        ID
    },
    {
        headers:{
            'Authorization': "Bearer "+getAccessToken(),
        }
    })

    return response;
}