<script lang="ts">
	import {goto} from "$app/navigation";
	import { currentUserId } from "../lib/stores";


  let username: String
  let password: String
  let canRegState: boolean = false;
  let buttonText: string = "Login";
  let regText: string = "Not having an account? Cringe. Make one.";
  let hovered: boolean = false
  async function loginOrReg(){
    if(username==null || password==null) {
    return
    }
    var apiUrl = canRegState ? "http://localhost:3000/user/register" : "http://localhost:3000/user/login"
    try{
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      if(res.status == 200 && !canRegState){
        goto('feed')
        const jsonData = await res.json()
        currentUserId.set(jsonData.id)
      }
      else if(res.status == 200 && canRegState) alert('User successfully created')
      else if(res.status == 400 && !canRegState) alert('Invalid password')
      else if(res.status == 404 && !canRegState) alert('User not found')
      else if(res.status == 400 && canRegState) alert('Username is already in use')

    }
    catch(err){
      console.error(err)
    }
    username = ""
    password = ""
  }
  function changeState() {
    if (canRegState) {
      canRegState = false;
      buttonText = "Login";
      regText = "Not having an account? Cringe. Make one.";
      username = ""
      password = ""

    } else {
        canRegState = true;
        buttonText = "Register";
        regText = "Back to Login";
        username = ""
        password = ""
      }
    }
  function onHover(){
        hovered ? hovered = false : hovered=true
  }
  
</script>


<div class="bg-zinc-800 w-screen h-screen flex justify-center items-center">
  <div class="bg-black/30 text-white p-8 h-fit rounded-md">
    <h1 class="text-center text-3xl mb-6 font-bold">{buttonText}</h1>
    <form on:submit|preventDefault>
      <ul>
        <li class="text-center"><input type="text" placeholder="Username" class="p-2 mt-2 bg-black/20" bind:value={username}></li>
        <li class="text-center"><input type="password" placeholder="Password" class="p-2 mt-2 bg-black/20" bind:value={password}></li>
        <li class="flex justify-center align-middle"><button class="mt-4 p-2 rounded-xl {canRegState ? 'bg-blue-500' : 'bg-green-500'} border-black" on:click={loginOrReg}>{buttonText}</button></li>
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <li class="flex justify-center mt-2">
          <button on:click={changeState} on:mouseover={onHover} 
            on:mouseout={onHover} class="{hovered ? 'underline' : ''}
            {hovered ? 'cursor-pointer' : ''} text-blue-500">{regText}</button>
        </li>
 
      </ul>
    </form> 
  </div>
</div>
