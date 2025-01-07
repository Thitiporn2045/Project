import { CommentInterface, QuickRepliesInterface } from "../../../interfaces/psychologist/IComment";

const apiUrl = "http://localhost:8080";

export async function ListCommentByDiaryId(id:number) {
    const requestOptions = {
        method:"GET",
        header:{
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/comments/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });

  return res;
    
}

export async function CreateComment(data: CommentInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/comment`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return { status: true, message: res.data };
        } else {
          return { status: false, message: res.error };
        }
      });
  
    return res;
}

export async function UpdateComment(data: CommentInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/comment`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
        if (res.data) {
        return { status: true, message: res.data };
        } else {
        return { status: false, message: res.error };
        }
    });

    return res;
    
}

export async function DeleteComment(id:number) {
    const requestOptions = {
        method: "DELETE",
    };
    
    let res = await fetch(`${apiUrl}/comment/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
        if (res.data) {
        return { status: true, message: res.data };
        } else {
        return { status: false, message: res.error };
        }
    });

    return res;
    
}

//==================== Quick Replies ==================================

export async function ListQuickReplies(id:number) {
  const requestOptions = {
      method:"GET",
      header:{
        "Content-Type": "application/json",
      },
  };

  let res = await fetch(`${apiUrl}/quickReplies/${id}`, requestOptions)
  .then((response) => response.json())
  .then((res) => {
    if (res.data) {
      return res.data;
    } else {
      return false;
    }
  });

return res;
  
}

export async function CreateQuickReplies(data: QuickRepliesInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/quickReply`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}

export async function UpdateQuickReplies(data: QuickRepliesInterface) {
  const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/quickReply`, requestOptions)
  .then((response) => response.json())
  .then((res) => {
      if (res.data) {
      return { status: true, message: res.data };
      } else {
      return { status: false, message: res.error };
      }
  });

  return res;
  
}

export  async function DeleteQuickReplies(id:number) {
  const requestOptions = {
      method: "DELETE",
  };
  
  let res = await fetch(`${apiUrl}/quickReply/${id}`, requestOptions)
  .then((response) => response.json())
  .then((res) => {
      if (res.data) {
      return { status: true, message: res.data };
      } else {
      return { status: false, message: res.error };
      }
  });

  return res;
  
}




