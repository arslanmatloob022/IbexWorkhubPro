<script setup lang="ts">
import { isLargeScreen } from '/@src/utils/responsive'
import VueScrollTo from 'vue-scrollto'

import { useDarkmode } from '/@src/stores/darkmode'

const isMobileNavOpen = ref(false)
const darkmode = useDarkmode()
const scrollTo = VueScrollTo.scrollTo

const { y } = useWindowScroll()

const isScrolling = computed(() => {
  return y.value > 30
})

watchEffect(() => {
  if (isLargeScreen.value) {
    isMobileNavOpen.value = false
  }
})
</script>

<template>
    <div :id="isScrolling ? 'nav_scroll_on':'nav_scroll_off'">
        <nav >
            <input type="checkbox" id="nav-toggle">
            <div class="logo">
                <img
                    style="width: 36px; height: 36px;background-color:transparent"
                    src="/images/logos/Arez.io_favicon_v3.0.png"
                    />
            </div>
            <ul class="links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#work">Work</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact" class="gradient-text">Login</a></li>
            </ul>
            <label for="nav-toggle" class="icon-burger">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </label>
        </nav>
    </div>




</template>

<style lang="scss" scoped>


#nav_scroll_on{
    .container {
    position: relative;
    margin-top: 100px;
}
.container img {
    display: block;
    width: 100%;
}

nav {
    position: fixed;
    z-index: 10;
    left: 0;
    right: 0;
    top: 0;
    font-family: 'Montserrat', 'sans-serif';
    height: 100px;
    padding: 0 5%;
    background-color: white;
    transition: all 0.3s;

}
nav .logo { 
    float: left;
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 24px;
    color: #fff;
}
nav .links {
    float: right;
    padding: 0;
    margin: 0;
    // width: 60%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
nav .links li {
    list-style: none;
}
 nav   .links a {
    display: block;
    padding: 1em;
    font-size: 16px;
    font-weight: bold;
    color: #333 !important;
    text-decoration: none;
    position: relative;
}
 nav   .links a:hover {
    color: #333;
}
 nav  .links a::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #333;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out 0s;
}
 nav   .links a:hover::before {
    visibility: visible;
    transform: scaleX(1);
    color: #333;
}

// No Scroll
nav .links a {
    display: block;
    padding: 1em;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    text-decoration: none;
    position: relative;
}
nav .links a:hover {
    color: #333;
}
nav .links a::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #333;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out 0s;
}
nav .links a:hover::before {
    visibility: visible;
    transform: scaleX(1);
    color: #333;
}
#nav-toggle {
     position: absolute;
     top: -100px;
}
nav .icon-burger {
    display: none;
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
}
nav .icon-burger .line {
    width: 30px;
    height: 5px;
    background-color: #333;
    margin: 5px;
    border-radius: 3px;
    transition: all .5s ease-in-out;
}
@media screen and (max-width: 768px) {
    nav .logo {
        float: none;
        width: auto;
        justify-content: center;
    }
    nav .links {
        float: none;
        position: fixed;
        z-index: 9;
        left: 0;
        right: 0;
        top: 100px;
        bottom: 100%;
        width: auto;
        height: auto;
        flex-direction: column;
        justify-content: space-evenly;
        background-color: rgba(0, 0, 0, .8);
        overflow: hidden;
        transition: all .5s ease-in-out;
    }
    nav .links a {
        font-size: 20px;
    }
    nav   .links a {
    display: block;
    padding: 1em;
    font-size: 16px;
    font-weight: bold;
    color: #fff !important;
    text-decoration: none;
    position: relative;
}
 nav   .links a:hover {
    color: #fff;
}
    nav :checked ~ .links {
        bottom: 0;
    }
    nav .icon-burger {
        display: block;
    }
    nav :checked ~ .icon-burger .line:nth-child(1) {
        transform: translateY(10px) rotate(225deg);
    }
    nav :checked ~ .icon-burger .line:nth-child(3) {
        transform: translateY(-10px) rotate(-225deg);
    }
    nav :checked ~ .icon-burger .line:nth-child(2) {
        opacity: 0;
    }
}


.gradient-text{
    // color: linear-gradient(112deg, #56f38b 0%, #0bbbcf) !important;
    background-image: linear-gradient(59.94deg,#56f38b,#56f38b 40%,#0bbbcf 100%);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;

}
  }

  #nav_scroll_off{
    .container {
    position: relative;
    margin-top: 100px;
}
.container img {
    display: block;
    width: 100%;
}

nav {
    position: fixed;
    z-index: 10;
    left: 0;
    right: 0;
    top: 0;
    font-family: 'Montserrat', 'sans-serif';
    height: 100px;
    padding: 0 5%;
    

}
nav .logo { 
    float: left;
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 24px;
    color: #fff;
}
nav .links {
    float: right;
    padding: 0;
    margin: 0;
    // width: 60%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
nav .links li {
    list-style: none;
}
 nav   .links a {
    display: block;
    padding: 1em;
    font-size: 16px;
    font-weight: bold;
    color: #fff !important;
    text-decoration: none;
    position: relative;
}
 nav   .links a:hover {
    color: #fff;
}
 nav  .links a::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #fff;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out 0s;
}
 nav   .links a:hover::before {
    visibility: visible;
    transform: scaleX(1);
    color: #fff;
}

// No Scroll
nav .links a {
    display: block;
    padding: 1em;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    text-decoration: none;
    position: relative;
}
nav .links a:hover {
    color: white;
}
nav .links a::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: white;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out 0s;
}
nav .links a:hover::before {
    visibility: visible;
    transform: scaleX(1);
    color: white;
}
#nav-toggle {
     position: absolute;
     top: -100px;
}
nav .icon-burger {
    display: none;
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
}
nav .icon-burger .line {
    width: 30px;
    height: 5px;
    background-color: #fff;
    margin: 5px;
    border-radius: 3px;
    transition: all .5s ease-in-out;
}
@media screen and (max-width: 768px) {
    nav .logo {
        float: none;
        width: auto;
        justify-content: center;
    }
    nav .links {
        float: none;
        position: fixed;
        z-index: 9;
        left: 0;
        right: 0;
        top: 100px;
        bottom: 100%;
        width: auto;
        height: auto;
        flex-direction: column;
        justify-content: space-evenly;
        background-color: rgba(0, 0, 0, .8);
        overflow: hidden;
        transition: all .5s ease-in-out;
    }
    nav .links a {
        font-size: 20px;
    }
    nav :checked ~ .links {
        bottom: 0;
    }
    nav .icon-burger {
        display: block;
    }
    nav :checked ~ .icon-burger .line:nth-child(1) {
        transform: translateY(10px) rotate(225deg);
    }
    nav :checked ~ .icon-burger .line:nth-child(3) {
        transform: translateY(-10px) rotate(-225deg);
    }
    nav :checked ~ .icon-burger .line:nth-child(2) {
        opacity: 0;
    }
}


.gradient-text{
    // color: linear-gradient(112deg, #56f38b 0%, #0bbbcf) !important;
    background-image: linear-gradient(59.94deg,#56f38b,#56f38b 40%,#0bbbcf 100%);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;

}
  }
</style>
