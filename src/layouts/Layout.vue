<template>
    <div class="LayoutDefault">
        <b-navbar toggleable="md" type="dark" variant="dark">
            <b-navbar-brand href="#">
                <img src="@/assets/logo.png" width="32" height="32" />
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse">
                <span class="navbar-toggler-icon"></span>
            </b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <slot name="header"></slot>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div class="container-fluid">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Layout',
}
</script>