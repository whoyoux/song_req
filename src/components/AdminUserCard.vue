<template>
    <div 
        class="user"
        :class="user.role === 'Admin' ? 'admin' : ''"
    >
        {{user.nickname}}
    </div>
</template>

<script>
export default {
    name: 'AdminUserCard',
    props: {
        user: Object
    }
}
</script>

<style>
.user {
    width: 50vw;
    height: auto;
    border: 1px solid #eee;
    padding: 15px;
    margin: 15px;
    border-radius: 4px;
    margin-left: auto;
    margin-right: auto;
}
.admin {
    border: 1px solid red;
}

router-link::hover {
    text-decoration: none; 
}
</style>