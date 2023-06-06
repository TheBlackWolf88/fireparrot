
<script lang="ts">
	import {onMount} from "svelte";
	import { currentUserId } from "../../lib/stores";
	import { goto } from "$app/navigation";
	import { marked } from "marked";
  interface Post {
    userId: Number,
    postText: string,
    imageUrl: string,
    postedAt: string
  }

  let postText: String
  let posts: [Post]
  let uname: String
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
    getPosts()
  }
  async function getPosts(){
    const res = await fetch('http://localhost:3000/post/getAllPosts', {method:'GET'})
    posts = await res.json()
    console.log(posts)
  }

  async function getUserById(id:Number) {
    const res = await fetch(`http://localhost:3000/user/getUser/${id}`)

    const user = await res.json()
    return await user[0].username
  }

  onMount(async () => {
    if($currentUserId == 0){
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
      <div class="text-white w-2/3 h-fit m-5 py-8 px-8 flex justify-center bg-zinc-800 rounded-2xl">
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
        <div class="text-left text-white w-2/3 h-fit m-5 py-8 px-8 bg-zinc-800 rounded-2xl">
          <ul>
            <li>{getUserById(post.userId)}</li>
          </ul>
          {@html marked.parse(post.postText)}
        </div>
      </li>
    {/each}
  {/if}
    </ul>
        
    </div>
  </div>
</body>

