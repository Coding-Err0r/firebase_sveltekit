<script lang="ts">
  import { storage, db } from "$lib/firebase";
  import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    updateDoc,
    Timestamp,
  } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { v4 as uuidv4 } from "uuid";

  let title = "";
  let description = "";
  let files: any[] | any = [];
  let previewURLs: string[] = [];
  let images: any[] = [];

  async function onFileSelected(e: any) {
    files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      images.push(
        Object.assign(files[i], {
          preview: URL.createObjectURL(files[i]),
        })
      );
      previewURLs.push(URL.createObjectURL(files[i]));
    }
    previewURLs = previewURLs;
  }
  async function onSubmit() {
    const uuid: any = uuidv4();
    const docRef = await addDoc(collection(db, "posts"), {
      title: title,
      description: description,
      createdAt: Timestamp.now().toDate(),
    });

    await Promise.all(
      images.map(async (image: any) => {
        const imageRef = ref(storage, `posts/${docRef.id}/${image.name}`);
        uploadBytes(imageRef, image).then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "posts", docRef.id), {
            images: arrayUnion(downloadURL),
          });
        });
      })
    );
    title = "";
    description = "";
    previewURLs = [];
    files = [];
    images = [];
    console.log("Upload Complete");
  }
</script>

<form class="p-8">
  <div class="flex flex-col px-4 space-y-6">
    <div>
      <label for="title" class="block mb-2 text-gray-900 font-mgedium text-l"
        >Game Title</label
      >
      <input
        type="text"
        id="title"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="This is my first post."
        bind:value={title}
        required
      />
    </div>
    <div>
      <label
        for="description"
        class="block mb-2 text-gray-900 font-mgedium text-l">Description</label
      >
      <textarea
        id="description"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="Game Description."
        bind:value={description}
        required
      />
    </div>

    <div class="flex items-center justify-center w-full">
      <label
        for="dropzone-file"
        class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            class="w-8 h-8 mb-4 text-gray-500 animate-bounce"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          class="hidden"
          multiple
          bind:files
          on:change={onFileSelected}
        />
      </label>
    </div>

    {#if previewURLs.length > 0}
      <div class="grid grid-cols-6 gap-4">
        {#each previewURLs as image, index}
          <img
            src={image}
            alt={image}
            class="object-cover h-24 transition-all duration-200 ease-in-out transform w-44 hover:scale-110"
          />
        {/each}
      </div>
    {:else}
      <p>No images uploaded</p>
    {/if}
    <button
      type="submit"
      on:click={onSubmit}
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >Submit</button
    >
  </div>
</form>
