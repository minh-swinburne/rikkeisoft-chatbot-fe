<template>
    <div class="nav-bar-container">
        <!-- navbar -->
    </div>
    <div class="side-bar-container">
        <!-- sidebar -->
    </div>
    <div class="main-container d-flex flex-column">
        <div class="text-generate-contrainer flex-grow-1">
            <!-- place for text generate -->
        </div>
        <div class="box-chat-container d-flex">
            <div class="col-2 col-md-2">
            <!-- file upload button -->
            </div>
            <input class="box-chat col-9 col-md-9" type="text">
            <!-- send button -->
        </div>
    </div>
</template>

<script>
export default {
  name: 'ChatboxPage',
};
</script>

<style>
.main-container {
    width: 100vw;
    height: 100vh;
    padding: 3%;
}

.box-chat-container{
    height: 10%;
    align-items: center;
}

.box-chat{
    height: 70%;
    border-radius: 10px;
    border-width: 1px;
}



</style>