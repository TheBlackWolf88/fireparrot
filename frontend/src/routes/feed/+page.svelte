
<script lang="ts">
	import {onMount} from "svelte";
	import { currentUserId } from "../../lib/stores";
	import { goto } from "$app/navigation";
	import { marked } from "marked";

  marked.use({
    mangle:false,
    headerIds:false
  })

  type Post = {
    id: string
    username: string,
    postText: string,
    imageUrl: string,
    likes : Number,
    created_at: string
  }

  let postText: String
  let posts: [Post]
  let uname: String
 

  function handleDates () {
    for(let post of posts) {
      const date = new Date(post.created_at)
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone
      post.created_at = date.toLocaleString('en-us', {timeZone: userTz})
    }
    posts=posts
 }

  async function post(){
    if (!postText) return
    const res = await fetch('http://localhost:3000/post/createPost', {
      method:'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: $currentUserId,
        postText : postText,
        imageUrl: "helo",
      }),
    })
    postText = ""
    await getPosts()
  }
  async function getPosts(){
    const res = await fetch('http://localhost:3000/post/getAllPosts', {method:'GET'})
    posts = await res.json()
    handleDates()
  }

  async function getUserById(id:string) {
    const res = await fetch(`http://localhost:3000/user/getUser/${id}`)

    const user = await res.json()
    return await user[0].username
  }

  async function addLike (post:Post) {
    const res = await fetch(`https://localhost:3000/post/addLikeToPost`, {
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: post.id,
        })
      })
    const resPost = await res.json()
    post.likes = resPost.likes
    
  }

  onMount(async () => {
    if($currentUserId == ""){
      goto('/')
      alert('Session expired')
      return;
    }
    uname = await getUserById($currentUserId);
    await getPosts();
    })
</script>
<body class="bg-zinc-800">
  <div class="w-screen h-screen ">
    <div class="block w-screen h-16 p-4 bg-zinc-950 text-white">
      <div class="flex items-center">
        <img src="/logo.png" alt="logo" class="w-28 h-auto">
        <button on:click={getPosts} class="mx-auto">Refresh</button>
        <p class="">Logged in as {uname}</p>
      </div>
      </div>
    <div class="w-2/3 flex justify-center rounded-3xl bg-black/30 overflow-hidden mx-auto my-2">
    <ul class="overflow-auto">
      <li class="flex justify-center">
      <div class="text-white w-2/3 h-fit m-5 pt-4 pb-0 px-8 flex justify-center bg-zinc-800 rounded-2xl">
        <form on:submit|preventDefault>
          <label for="post" class="mb-2">Post about anything! You can even use markdown to style it!</label>
          <textarea id="post" placeholder="Write text here" bind:value={postText} class="w-full h-24 bg-zinc-700 p-2 rounded-2xl"></textarea>
          <button on:click={post}>Post</button>
        </form>
      </div>
      </li>
  {#if posts}
    {#each posts as post}
      <li class="flex justify-center">
        <div class="text-left text-white w-2/3 h-fit m-5 pt-8 px-8 bg-zinc-800 rounded-2xl">
          <ul>
            <li><span class="font-bold">{post.username}<span> <span class="float-right text-xs opacity-40">{post.created_at}</span></li>
            <li class="mt-4">{@html marked.parse(post.postText)}</li>
            <li class="mt-2 mb-0"><button class="hover:bg-zinc-600 hover:cursor-pointer p-2" on:click={() => addLike(post)}>+𝟙</button><span class="mx-2">{post.likes}</span><button class="hover:bg-zinc-600 hover:cursor-pointer p-2">-𝟙</button></li>
          </ul>
        </div>
      </li>
    {/each}
  {/if}
    </ul>
        
    </div>
  </div>
</body>

