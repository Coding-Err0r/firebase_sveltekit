<script lang="ts">
  import {
    collection,
    deleteDoc,
    onSnapshot,
    doc,
    getDoc,
  } from "firebase/firestore";
  import { storage, db } from "$lib/firebase";
  import { getStorage, ref, deleteObject } from "firebase/storage";

  let posts: any[] = [];
  const collectionRef = collection(db, "posts");

  onSnapshot(collectionRef, (querySnapshot) => {
    let fbPosts: any = [];
    querySnapshot.forEach((doc) => {
      let post = { ...doc.data(), id: doc.id };
      fbPosts = [post, ...fbPosts];
    });
    posts = fbPosts;
  });

  const deletePost = async (id: any) => {
    const collectionRef = doc(db, "posts", id);
    getDoc(collectionRef)
      .then((doc) => {
        const response = {
          title: doc.data()?.title,
          description: doc.data()?.description,
          createdAt: doc.data()?.createdAt,
          images: doc.data()?.images,
        };
        response.images.map((image: any) => {
          const desertRef = ref(storage, image);
          deleteObject(desertRef)
            .then(() => {
              console.log("Images successfully deleted");
            })
            .catch((error) => {
              console.error("Error: " + error);
            });
        });
      })
      .then(async () => {
        await deleteDoc(doc(db, "posts", id));
      });
  };
</script>

<div class="py-12">
  {#if posts.length > 0}
    <div class="flex flex-col items-center space-y-6">
      {#each posts as post, index}
        <div
          class="relative flex flex-col items-center p-4 space-y-2 text-gray-600 transition-all duration-100 ease-in-out transform hover:scale-105 bg-black/30 w-fit rounded-2xl"
        >
          <button class="absolute right-5" on:click={() => deletePost(post.id)}
            >❌</button
          >
          <h1 class="text-3xl font-bold">{post.title}</h1>
          <p class="text-lg">{post.description}</p>
          <div class="grid grid-cols-2 gap-2">
            {#each post.images as image}
              <img src={image} alt={image} class=" w-72 h-44" />
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="flex items-center justify-center space-x-2">
      <h1 class="text-3xl font-extrabold text-red-500">No Post Available</h1>
      <p class="animate-ping">😭</p>
    </div>{/if}
</div>
