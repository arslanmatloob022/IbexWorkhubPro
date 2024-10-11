// vite.config.ts
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/vite@5.0.0-beta.0_8f28b5a21e16bd357cd10b42f3fe6fcb/node_modules/vite/dist/node/index.js";
import Vue from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/@vitejs+plugin-vue@4.3.3_vite@5.0.0-beta.0+vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/unplugin-vue-router@0.6.4_vue-router@4.2.4+vue@3.3.4/node_modules/unplugin-vue-router/dist/vite.mjs";
import { VueRouterAutoImports } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/unplugin-vue-router@0.6.4_vue-router@4.2.4+vue@3.3.4/node_modules/unplugin-vue-router/dist/index.mjs";
import Components from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/unplugin-vue-components@0.25.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/unplugin-auto-import@0.16.6_@vueuse+core@10.4.0/node_modules/unplugin-auto-import/dist/vite.js";
import Unfonts from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/unplugin-fonts@1.0.3_vite@5.0.0-beta.0/node_modules/unplugin-fonts/dist/vite.mjs";
import { VitePluginRadar } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/vite-plugin-radar@0.9.1_vite@5.0.0-beta.0/node_modules/vite-plugin-radar/dist/index.js";
import PurgeIcons from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/vite-plugin-purge-icons@0.9.2_vite@5.0.0-beta.0/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import ImageMin from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/vite-plugin-imagemin@0.6.1_vite@5.0.0-beta.0/node_modules/vite-plugin-imagemin/dist/index.mjs";
import VueI18nPlugin from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/@intlify+unplugin-vue-i18n@0.12.3_vue-i18n@9.3.0-beta.25/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { VitePWA } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/vite-plugin-pwa@0.16.4_vite@5.0.0-beta.0/node_modules/vite-plugin-pwa/dist/index.js";
import purgecss from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/rollup-plugin-purgecss@5.0.0/node_modules/rollup-plugin-purgecss/lib/rollup-plugin-purgecss.js";
import UnheadVite from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/@unhead+addons@1.3.7/node_modules/@unhead/addons/dist/vite.mjs";
import { unheadVueComposablesImports } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/@unhead+vue@1.3.7_vue@3.3.4/node_modules/@unhead/vue/dist/index.mjs";

// vite-plugin-vuero-doc/index.ts
import { join, basename } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/pathe@1.1.2/node_modules/pathe/dist/index.mjs";
import { compileTemplate, parse } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/@vue+compiler-sfc@3.5.8/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js";

// vite-plugin-vuero-doc/markdown.ts
import yaml from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/js-yaml@4.1.0/node_modules/js-yaml/dist/js-yaml.mjs";
import remarkShiki from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/@stefanprobst+remark-shiki@2.2.1_shiki@0.14.3/node_modules/@stefanprobst/remark-shiki/src/index.js";
import rehypeExternalLinks from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/rehype-external-links@2.1.0/node_modules/rehype-external-links/index.js";
import rehypeRaw from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/rehype-raw@7.0.0/node_modules/rehype-raw/index.js";
import rehypeSlug from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/rehype-slug@5.1.0/node_modules/rehype-slug/index.js";
import rehypeAutolinkHeadings from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/rehype-autolink-headings@6.1.1/node_modules/rehype-autolink-headings/index.js";
import rehypeStringify from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/rehype-stringify@10.0.0/node_modules/rehype-stringify/index.js";
import remarkParse from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/remark-parse@10.0.2/node_modules/remark-parse/index.js";
import remarkGfm from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/remark-gfm@3.0.1/node_modules/remark-gfm/index.js";
import remarkRehype from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/remark-rehype@10.1.0/node_modules/remark-rehype/index.js";
import remarkFrontmatter from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/remark-frontmatter@4.0.1/node_modules/remark-frontmatter/index.js";
import { getHighlighter } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/shiki@0.14.3/node_modules/shiki/dist/index.js";
import { unified } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/unified@11.0.2/node_modules/unified/index.js";
var langs = ["vue", "vue-html", "typescript", "bash", "scss"];
async function createProcessor(theme) {
  const highlighter = await getHighlighter({
    theme,
    langs
  });
  return unified().use(remarkParse).use(remarkFrontmatter).use(() => (tree, file) => {
    if (tree.children[0].type === "yaml") {
      file.data.frontmatter = yaml.load(tree.children[0].value);
    }
  }).use(remarkGfm).use(remarkShiki, { highlighter }).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeExternalLinks, { rel: ["nofollow"], target: "_blank" }).use(rehypeSlug).use(rehypeAutolinkHeadings, {
    behavior: "append",
    content: {
      type: "element",
      tagName: "i",
      properties: {
        className: ["iconify toc-link-anchor"],
        dataIcon: "feather:link"
      },
      children: []
    },
    test: (node) => {
      if (Array.isArray(node.properties?.className) && node.properties?.className?.includes("toc-ignore")) {
        return false;
      }
      return Boolean(node.properties?.id);
    }
  }).use(rehypeStringify);
}
async function createProcessors(theme) {
  return {
    light: await createProcessor(typeof theme === "string" ? theme : theme.light),
    dark: await createProcessor(typeof theme === "string" ? theme : theme.dark)
  };
}

// vite-plugin-vuero-doc/transform.ts
import { kebabCase } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/scule@1.0.0/node_modules/scule/dist/index.mjs";
var SELF_CLOSING_TAG_REGEX = /<([^\s></]+)([^>]+)\/>/g;
var OPEN_TAG_REGEX = /<([^\s></]+)/g;
var CLOSE_TAG_REGEX = /<\/([^\s></]+)/g;
function transformExampleMarkup(raw) {
  let output = raw;
  let content = null;
  if (content = raw.match(/<!--example-->([\s\S]*?)<!--\/example-->/)) {
    const kebabContent = content[1].replaceAll(SELF_CLOSING_TAG_REGEX, (substring, tag) => {
      return substring.replace("/>", `></${tag.trim()}>`);
    }).replaceAll(OPEN_TAG_REGEX, (substring) => {
      return `<${kebabCase(substring.substring(1).trim())}`;
    }).replaceAll(CLOSE_TAG_REGEX, (substring) => {
      return `</${kebabCase(substring.substring(2).trim())}`;
    }).replaceAll("&#x27;", "'");
    output = output.replace(content[1], kebabContent);
  }
  return output;
}
function transformSlots(source, condition = "") {
  if (source.includes("<!--code-->") && source.includes("<!--example-->")) {
    return `<template ${condition} #default>${source}`.replace(
      `<!--code-->`,
      `</template><template ${condition} #code>
<slot name="code"><div v-pre>`
    ).replace(`<!--/code-->`, `</div></slot>
</template>`).replace(
      `<!--example-->`,
      `<template ${condition} #example>
<slot name="example">`
    ).replace(`<!--/example-->`, `</slot>
</template>`);
  }
  if (source.includes("<!--code-->")) {
    return `<template ${condition} #default>${source}`.replace(
      `<!--code-->`,
      `</template><template ${condition} #code>
<slot name="code"><div v-pre>`
    ).replace(
      `<!--/code-->`,
      `</div></slot>
</template>
<template ${condition} #example><slot name="example"></slot></template>`
    );
  }
  if (source.includes("<!--example-->")) {
    return `<template ${condition} #default>${source}`.replace(
      `<!--example-->`,
      `</template><template ${condition} #example>
<slot name="example">`
    ).replace(
      `<!--/example-->`,
      `</slot>
</template>
<template ${condition} #code><slot name="code"></slot></template>`
    );
  }
  return `<template ${condition} #default>${source}</template><template ${condition} #example><slot name="example"></slot></template><template ${condition} #code><slot name="code"></slot></template>`;
}

// vite-plugin-vuero-doc/index.ts
function parseId(id) {
  const index = id.indexOf("?");
  if (index < 0)
    return id;
  else
    return id.slice(0, index);
}
function VitePluginVueroDoc(options) {
  let config;
  let processors;
  const cwd = process.cwd();
  const pathPrefix = options.pathPrefix ? join(cwd, options.pathPrefix) : cwd;
  async function markdownToVue(id, raw) {
    const path = parseId(id);
    const input = transformExampleMarkup(raw);
    if (!processors)
      processors = await createProcessors(options.shiki.theme);
    const [vFileLight, vFileDark] = await Promise.all([
      processors.light.process(input),
      processors.dark.process(input)
    ]);
    const contentLight = vFileLight.toString();
    const contentDark = vFileDark.toString();
    const frontmatter = vFileLight.data?.frontmatter ?? {};
    const slotLight = transformSlots(contentLight, 'v-if="!darkmode.isDark"');
    const slotDark = transformSlots(contentDark, 'v-if="darkmode.isDark"');
    const sfc = [
      `<template>`,
      `  <${options.wrapperComponent} :frontmatter="frontmatter" :source-meta="sourceMeta">`,
      `    ${slotLight}`,
      `    ${slotDark}`,
      `  </${options.wrapperComponent}>`,
      `</template>`
    ].join("\n");
    const result = parse(sfc, {
      filename: path,
      sourceMap: true
    });
    if (result.errors.length || result.descriptor.template === null) {
      console.error(result.errors);
      throw new Error(`Markdown: unable to parse virtual file generated for "${id}"`);
    }
    const { code, errors } = compileTemplate({
      filename: path,
      id: path,
      source: result.descriptor.template.content,
      preprocessLang: result.descriptor.template.lang,
      transformAssetUrls: false
    });
    if (errors.length) {
      console.error(errors);
      throw new Error(`Markdown: unable to compile virtual file "${id}"`);
    }
    let sourceMeta = "undefined";
    if (options.sourceMeta?.enabled) {
      sourceMeta = JSON.stringify({
        relativePath: path.substring(cwd.length),
        basename: basename(path),
        path: config?.isProduction ? "" : path,
        editProtocol: config?.isProduction ? "" : options.sourceMeta.editProtocol
      });
    }
    const output = [
      `import { reactive } from 'vue'`,
      `import { useDarkmode } from '/@src/stores/darkmode'`,
      code.replace("export function render", "function render"),
      `const __frontmatter = ${JSON.stringify(frontmatter)};`,
      `const setup = () => ({`,
      `  frontmatter: reactive(__frontmatter),`,
      `  darkmode: useDarkmode(),`,
      `  sourceMeta: ${sourceMeta},`,
      `});`,
      `const __script = { render, setup };`,
      config?.isProduction ? "" : `__script.__hmrId = ${JSON.stringify(path)};`,
      `export default __script;`
    ].join("\n");
    return output;
  }
  return {
    name: "vite-plugin-vuero-doc",
    enforce: "pre",
    configResolved(_config) {
      config = _config;
    },
    async transform(raw, id) {
      if (id.endsWith(".md") && id.startsWith(pathPrefix)) {
        return await markdownToVue(id, raw);
      }
    }
  };
}

// vite-plugin-purge-comments/index.ts
import MagicString from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/.pnpm/magic-string@0.30.3/node_modules/magic-string/dist/magic-string.es.mjs";
function parseId2(id) {
  const index = id.indexOf("?");
  if (index < 0)
    return id;
  else
    return id.slice(0, index);
}
function VitePluginPurgeComments({ sourcemap = false } = {}) {
  return {
    name: "purge-comments",
    enforce: "pre",
    transform: (code, id) => {
      const parsedId = parseId2(id);
      if (!(parsedId.endsWith(".vue") || parsedId.endsWith(".html") || parsedId.endsWith(".svg"))) {
        return;
      }
      if (!code.includes("<!--")) {
        return;
      }
      const s = new MagicString(code);
      s.replace(/<!--[\w\W\s]*?-->/g, "");
      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: sourcemap && s.generateMap({ source: id, includeContent: true })
        };
      }
    }
  };
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/vite.config.ts";
var MINIFY_IMAGES = process.env.MINIFY ? process.env.MINIFY === "true" : false;
var isProd = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig({
  // Project root directory (where index.html is located).
  root: process.cwd(),
  // Base public path when served in development or production.
  // You also need to add this base like `history: createWebHistory('my-subdirectory')`
  // in ./src/router.ts
  // base: '/my-subdirectory/',
  base: "/",
  // Directory to serve as plain static assets.
  publicDir: "public",
  // Adjust console output verbosity.
  logLevel: "info",
  // development server configuration
  server: {
    // Vite 4 defaults to 5173, but you can override it with the port option.
    port: 3e3
  },
  /**
   * Define allow to replace string in the code at build time.
   */
  // build: {
  // },
  define: {
    // VSCODE_TEXTMATE_DEBUG is used in shiki, but it's not defined in the browser
    "process.env.VSCODE_TEXTMATE_DEBUG": "false"
  },
  /**
   * By default, Vite will crawl your index.html to detect dependencies that
   * need to be pre-bundled. If build.rollupOptions.input is specified,
   * Vite will crawl those entry points instead.
   *
   * @see https://vitejs.dev/config/#optimizedeps-entries
   */
  optimizeDeps: {
    include: [
      "@ckeditor/ckeditor5-vue",
      "@ckeditor/ckeditor5-build-classic",
      "@iconify/iconify",
      "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js",
      "@vee-validate/zod",
      "@vueuse/core",
      "@vueform/multiselect",
      "@vueform/slider",
      "billboard.js",
      "dayjs",
      "dropzone",
      "dragula",
      "defu",
      "filepond",
      "filepond-plugin-file-validate-size",
      "filepond-plugin-file-validate-type",
      "filepond-plugin-image-exif-orientation",
      "filepond-plugin-image-crop",
      "filepond-plugin-image-edit",
      "filepond-plugin-image-preview",
      "filepond-plugin-image-resize",
      "filepond-plugin-image-transform",
      "focus-trap-vue",
      "imask",
      "nprogress",
      "notyf",
      "mapbox-gl",
      "photoswipe/lightbox",
      "photoswipe",
      "plyr",
      "v-calendar",
      "vee-validate",
      "vue",
      "vue-scrollto",
      "vue3-apexcharts",
      "vue-tippy",
      "vue-i18n",
      "vue-router",
      "unplugin-vue-router/runtime",
      "simplebar",
      "tiny-slider/src/tiny-slider",
      "vue-accessible-color-picker",
      "zod",
      "@stefanprobst/remark-shiki",
      "rehype-external-links",
      "rehype-raw",
      "rehype-sanitize",
      "rehype-stringify",
      "rehype-slug",
      "rehype-autolink-headings",
      "remark-gfm",
      "remark-parse",
      "remark-rehype",
      "shiki",
      "unified",
      "workbox-window",
      "textarea-markdown-editor/dist/esm/bootstrap"
    ]
    // disabled: false,
  },
  // Will be passed to @rollup/plugin-alias as its entries option.
  resolve: {
    alias: [
      {
        find: "/@src/",
        replacement: `/src/`
      }
    ]
  },
  build: {
    target: "esnext",
    minify: "terser",
    // Do not warn about large chunks
    // chunkSizeWarningLimit: Infinity,
    // Double the default size threshold for inlined assets
    // https://vitejs.dev/config/build-options.html#build-assetsinlinelimit
    assetsInlineLimit: 4096 * 2
    // commonjsOptions: { include: [] },
    // rollupOptions: {
    //   external: ["workbox-window"],
    // },
  },
  plugins: [
    /**
     * plugin-vue plugin inject vue library and allow sfc files to work (*.vue)
     *
     * @see https://github.com/vitejs/vite/tree/main/packages/plugin-vue
     */
    Vue({
      include: [/\.vue$/],
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),
    /**
     * unplugin-vue-i18n plugin does i18n resources pre-compilation / optimizations
     *
     * @see https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md
     */
    VueI18nPlugin({
      include: resolve(
        dirname(fileURLToPath(__vite_injected_original_import_meta_url)),
        "./src/locales/**"
      ),
      fullInstall: false,
      compositionOnly: true
    }),
    /**
     * unplugin-vue-router plugin generate routes based on file system
     * allow to use typed routes and usage of defineLoader
     *
     * @see https://github.com/posva/unplugin-vue-router
     * @see https://github.com/vuejs/rfcs/blob/ad69da2aee9242ef88f036713db68f3ef274bb1b/active-rfcs/0000-router-use-loader.md
     */
    VueRouter({
      routesFolder: "src/pages",
      dts: "./types/router.d.ts",
      /**
       * Data Fetching is an experimental feature from vue & vue-router
       *
       * @see https://github.com/vuejs/rfcs/discussions/460
       * @see https://github.com/posva/unplugin-vue-router/tree/main/src/data-fetching
       */
      dataFetching: true
    }),
    /**
     * Unhead provides a Vite plugin to optimise your builds, by removing composables that aren't needed and simplifying your code.
     *
     * @see https://unhead.harlanzw.com/guide/getting-started/vite-plugin
     */
    UnheadVite(),
    /**
     * unplugin-auto-import allow to automaticaly import modules/components
     *
     * @see https://github.com/antfu/unplugin-auto-import
     */
    AutoImport({
      dts: "./types/imports.d.ts",
      imports: [
        "vue",
        "@vueuse/core",
        VueRouterAutoImports,
        unheadVueComposablesImports
      ]
    }),
    /**
     * This is an internal vite plugin that load markdown files as vue components.
     *
     * @see /documentation
     * @see /vite-plugin-vuero-doc
     * @see /src/components/partials/documentation/DocumentationItem.vue
     * @see /src/composable/useMarkdownToc.ts
     */
    VitePluginVueroDoc({
      pathPrefix: "documentation",
      wrapperComponent: "DocumentationItem",
      shiki: {
        theme: {
          light: "min-light",
          dark: "github-dark"
        }
      },
      sourceMeta: {
        enabled: true,
        editProtocol: "vscode://vscode-remote/wsl+Ubuntu"
        // or 'vscode://file'
      }
    }),
    /**
     * This is an internal vite plugin that remove html comments from code.
     *
     * @see /vite-plugin-purge-comments
     */
    VitePluginPurgeComments(),
    /**
     * unplugin-vue-components plugin is responsible of autoloading components
     * documentation and md file are loaded for elements and components sections
     *
     * @see https://github.com/antfu/unplugin-vue-components
     */
    Components({
      dirs: ["documentation", "src/components", "src/layouts"],
      extensions: ["vue", "md"],
      dts: "./types/components.d.ts",
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/]
    }),
    /**
     * vite-plugin-purge-icons plugin is responsible of autoloading icones from multiples providers
     *
     * @see https://icones.netlify.app/
     * @see https://github.com/antfu/purge-icons/tree/main/packages/vite-plugin-purge-icons
     */
    PurgeIcons(),
    /**
     * vite-plugin-fonts plugin inject webfonts from differents providers
     *
     * @see https://github.com/stafyniaksacha/vite-plugin-fonts
     */
    Unfonts({
      google: {
        families: [
          {
            name: "Fira Code",
            styles: "wght@400;600"
          },
          {
            name: "Montserrat",
            styles: "wght@500;600;700;800;900"
          },
          {
            name: "Roboto",
            styles: "wght@300;400;500;600;700"
          }
        ]
      }
    }),
    /**
     * vite-plugin-radar plugin inject snippets from analytics providers
     *
     * @see https://github.com/stafyniaksacha/vite-plugin-radar
     */
    !process.env.GTM_ID ? void 0 : VitePluginRadar({
      gtm: {
        id: process.env.GTM_ID
      }
    }),
    /**
     * vite-plugin-pwa generate manifest.json and register services worker to enable PWA
     *
     * @see https://github.com/antfu/vite-plugin-pwa
     */
    VitePWA({
      base: "/",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png"
      ],
      manifest: {
        name: "Ibex - Real-Estate Builders",
        short_name: "Ibex",
        start_url: "/?utm_source=pwa",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      mode: isProd ? "production" : "development",
      // registerType: 'autoUpdate',
      workbox: {
        /**
         * precache files that match the glob pattern
         *
         * @see https://vite-pwa-org.netlify.app/guide/service-worker-precache.html
         */
        globPatterns: ["**/*.{js,css,ico,png,svg,webp,jpg,jpeg}"],
        /**
         * add external cache of google fonts
         *
         * @see https://vite-pwa-org.netlify.app/workbox/generate-sw.html
         */
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    /**
     * rollup-plugin-purgecss plugin is responsible of purging css rules
     * that are not used in the bundle
     *
     * @see https://github.com/FullHuman/purgecss/tree/main/packages/rollup-plugin-purgecss
     */
    purgecss({
      output: false,
      content: [`./src/**/*.vue`],
      variables: false,
      safelist: {
        standard: [
          /(autv|lnil|lnir|fas?)/,
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/
        ]
      },
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(
          /<style[^]+?<\/style>/gi,
          ""
        );
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
      }
    }),
    /**
     * vite-plugin-imagemin optimize all images sizes from public or asset folder
     *
     * @see https://github.com/anncwb/vite-plugin-imagemin
     */
    !MINIFY_IMAGES ? void 0 : ImageMin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 60
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
            active: false
          },
          {
            name: "removeEmptyAttrs",
            active: false
          }
        ]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4tdnVlcm8tZG9jL2luZGV4LnRzIiwgInZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9tYXJrZG93bi50cyIsICJ2aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzIiwgInZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgVnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSBcInVucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZVwiO1xuaW1wb3J0IHsgVnVlUm91dGVyQXV0b0ltcG9ydHMgfSBmcm9tIFwidW5wbHVnaW4tdnVlLXJvdXRlclwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XG5pbXBvcnQgVW5mb250cyBmcm9tIFwidW5wbHVnaW4tZm9udHMvdml0ZVwiO1xuaW1wb3J0IHsgVml0ZVBsdWdpblJhZGFyIH0gZnJvbSBcInZpdGUtcGx1Z2luLXJhZGFyXCI7XG5pbXBvcnQgUHVyZ2VJY29ucyBmcm9tIFwidml0ZS1wbHVnaW4tcHVyZ2UtaWNvbnNcIjtcbmltcG9ydCBJbWFnZU1pbiBmcm9tIFwidml0ZS1wbHVnaW4taW1hZ2VtaW5cIjtcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gXCJAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlXCI7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xuaW1wb3J0IHB1cmdlY3NzIGZyb20gXCJyb2xsdXAtcGx1Z2luLXB1cmdlY3NzXCI7XG5pbXBvcnQgVW5oZWFkVml0ZSBmcm9tIFwiQHVuaGVhZC9hZGRvbnMvdml0ZVwiO1xuaW1wb3J0IHsgdW5oZWFkVnVlQ29tcG9zYWJsZXNJbXBvcnRzIH0gZnJvbSBcIkB1bmhlYWQvdnVlXCI7XG5cbi8vIGxvY2FsIHZpdGUgcGx1Z2luXG5pbXBvcnQgeyBWaXRlUGx1Z2luVnVlcm9Eb2MgfSBmcm9tIFwiLi92aXRlLXBsdWdpbi12dWVyby1kb2NcIjtcbmltcG9ydCB7IFZpdGVQbHVnaW5QdXJnZUNvbW1lbnRzIH0gZnJvbSBcIi4vdml0ZS1wbHVnaW4tcHVyZ2UtY29tbWVudHNcIjtcblxuLy8gb3B0aW9ucyB2aWEgZW52IHZhcmlhYmxlc1xuY29uc3QgTUlOSUZZX0lNQUdFUyA9IHByb2Nlc3MuZW52Lk1JTklGWVxuICA/IHByb2Nlc3MuZW52Lk1JTklGWSA9PT0gXCJ0cnVlXCJcbiAgOiBmYWxzZTtcblxuY29uc3QgaXNQcm9kID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIG1haW4gY29uZmlndXJhdGlvbiBmaWxlIGZvciB2aXRlanNcbiAqXG4gKiBAc2VlIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgLy8gUHJvamVjdCByb290IGRpcmVjdG9yeSAod2hlcmUgaW5kZXguaHRtbCBpcyBsb2NhdGVkKS5cbiAgcm9vdDogcHJvY2Vzcy5jd2QoKSxcbiAgLy8gQmFzZSBwdWJsaWMgcGF0aCB3aGVuIHNlcnZlZCBpbiBkZXZlbG9wbWVudCBvciBwcm9kdWN0aW9uLlxuICAvLyBZb3UgYWxzbyBuZWVkIHRvIGFkZCB0aGlzIGJhc2UgbGlrZSBgaGlzdG9yeTogY3JlYXRlV2ViSGlzdG9yeSgnbXktc3ViZGlyZWN0b3J5JylgXG4gIC8vIGluIC4vc3JjL3JvdXRlci50c1xuICAvLyBiYXNlOiAnL215LXN1YmRpcmVjdG9yeS8nLFxuICBiYXNlOiBcIi9cIixcbiAgLy8gRGlyZWN0b3J5IHRvIHNlcnZlIGFzIHBsYWluIHN0YXRpYyBhc3NldHMuXG4gIHB1YmxpY0RpcjogXCJwdWJsaWNcIixcbiAgLy8gQWRqdXN0IGNvbnNvbGUgb3V0cHV0IHZlcmJvc2l0eS5cbiAgbG9nTGV2ZWw6IFwiaW5mb1wiLFxuICAvLyBkZXZlbG9wbWVudCBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICBzZXJ2ZXI6IHtcbiAgICAvLyBWaXRlIDQgZGVmYXVsdHMgdG8gNTE3MywgYnV0IHlvdSBjYW4gb3ZlcnJpZGUgaXQgd2l0aCB0aGUgcG9ydCBvcHRpb24uXG4gICAgcG9ydDogMzAwMCxcbiAgfSxcbiAgLyoqXG4gICAqIERlZmluZSBhbGxvdyB0byByZXBsYWNlIHN0cmluZyBpbiB0aGUgY29kZSBhdCBidWlsZCB0aW1lLlxuICAgKi9cbiAgLy8gYnVpbGQ6IHtcblxuICAvLyB9LFxuICBkZWZpbmU6IHtcbiAgICAvLyBWU0NPREVfVEVYVE1BVEVfREVCVUcgaXMgdXNlZCBpbiBzaGlraSwgYnV0IGl0J3Mgbm90IGRlZmluZWQgaW4gdGhlIGJyb3dzZXJcbiAgICBcInByb2Nlc3MuZW52LlZTQ09ERV9URVhUTUFURV9ERUJVR1wiOiBcImZhbHNlXCIsXG4gIH0sXG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCBWaXRlIHdpbGwgY3Jhd2wgeW91ciBpbmRleC5odG1sIHRvIGRldGVjdCBkZXBlbmRlbmNpZXMgdGhhdFxuICAgKiBuZWVkIHRvIGJlIHByZS1idW5kbGVkLiBJZiBidWlsZC5yb2xsdXBPcHRpb25zLmlucHV0IGlzIHNwZWNpZmllZCxcbiAgICogVml0ZSB3aWxsIGNyYXdsIHRob3NlIGVudHJ5IHBvaW50cyBpbnN0ZWFkLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvI29wdGltaXplZGVwcy1lbnRyaWVzXG4gICAqL1xuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICBcIkBja2VkaXRvci9ja2VkaXRvcjUtdnVlXCIsXG4gICAgICBcIkBja2VkaXRvci9ja2VkaXRvcjUtYnVpbGQtY2xhc3NpY1wiLFxuICAgICAgXCJAaWNvbmlmeS9pY29uaWZ5XCIsXG4gICAgICBcIkBtYXBib3gvbWFwYm94LWdsLWdlb2NvZGVyL2Rpc3QvbWFwYm94LWdsLWdlb2NvZGVyLm1pbi5qc1wiLFxuICAgICAgXCJAdmVlLXZhbGlkYXRlL3pvZFwiLFxuICAgICAgXCJAdnVldXNlL2NvcmVcIixcbiAgICAgIFwiQHZ1ZWZvcm0vbXVsdGlzZWxlY3RcIixcbiAgICAgIFwiQHZ1ZWZvcm0vc2xpZGVyXCIsXG4gICAgICBcImJpbGxib2FyZC5qc1wiLFxuICAgICAgXCJkYXlqc1wiLFxuICAgICAgXCJkcm9wem9uZVwiLFxuICAgICAgXCJkcmFndWxhXCIsXG4gICAgICBcImRlZnVcIixcbiAgICAgIFwiZmlsZXBvbmRcIixcbiAgICAgIFwiZmlsZXBvbmQtcGx1Z2luLWZpbGUtdmFsaWRhdGUtc2l6ZVwiLFxuICAgICAgXCJmaWxlcG9uZC1wbHVnaW4tZmlsZS12YWxpZGF0ZS10eXBlXCIsXG4gICAgICBcImZpbGVwb25kLXBsdWdpbi1pbWFnZS1leGlmLW9yaWVudGF0aW9uXCIsXG4gICAgICBcImZpbGVwb25kLXBsdWdpbi1pbWFnZS1jcm9wXCIsXG4gICAgICBcImZpbGVwb25kLXBsdWdpbi1pbWFnZS1lZGl0XCIsXG4gICAgICBcImZpbGVwb25kLXBsdWdpbi1pbWFnZS1wcmV2aWV3XCIsXG4gICAgICBcImZpbGVwb25kLXBsdWdpbi1pbWFnZS1yZXNpemVcIixcbiAgICAgIFwiZmlsZXBvbmQtcGx1Z2luLWltYWdlLXRyYW5zZm9ybVwiLFxuICAgICAgXCJmb2N1cy10cmFwLXZ1ZVwiLFxuICAgICAgXCJpbWFza1wiLFxuICAgICAgXCJucHJvZ3Jlc3NcIixcbiAgICAgIFwibm90eWZcIixcbiAgICAgIFwibWFwYm94LWdsXCIsXG4gICAgICBcInBob3Rvc3dpcGUvbGlnaHRib3hcIixcbiAgICAgIFwicGhvdG9zd2lwZVwiLFxuICAgICAgXCJwbHlyXCIsXG4gICAgICBcInYtY2FsZW5kYXJcIixcbiAgICAgIFwidmVlLXZhbGlkYXRlXCIsXG4gICAgICBcInZ1ZVwiLFxuICAgICAgXCJ2dWUtc2Nyb2xsdG9cIixcbiAgICAgIFwidnVlMy1hcGV4Y2hhcnRzXCIsXG4gICAgICBcInZ1ZS10aXBweVwiLFxuICAgICAgXCJ2dWUtaTE4blwiLFxuICAgICAgXCJ2dWUtcm91dGVyXCIsXG4gICAgICBcInVucGx1Z2luLXZ1ZS1yb3V0ZXIvcnVudGltZVwiLFxuICAgICAgXCJzaW1wbGViYXJcIixcbiAgICAgIFwidGlueS1zbGlkZXIvc3JjL3Rpbnktc2xpZGVyXCIsXG4gICAgICBcInZ1ZS1hY2Nlc3NpYmxlLWNvbG9yLXBpY2tlclwiLFxuICAgICAgXCJ6b2RcIixcbiAgICAgIFwiQHN0ZWZhbnByb2JzdC9yZW1hcmstc2hpa2lcIixcbiAgICAgIFwicmVoeXBlLWV4dGVybmFsLWxpbmtzXCIsXG4gICAgICBcInJlaHlwZS1yYXdcIixcbiAgICAgIFwicmVoeXBlLXNhbml0aXplXCIsXG4gICAgICBcInJlaHlwZS1zdHJpbmdpZnlcIixcbiAgICAgIFwicmVoeXBlLXNsdWdcIixcbiAgICAgIFwicmVoeXBlLWF1dG9saW5rLWhlYWRpbmdzXCIsXG4gICAgICBcInJlbWFyay1nZm1cIixcbiAgICAgIFwicmVtYXJrLXBhcnNlXCIsXG4gICAgICBcInJlbWFyay1yZWh5cGVcIixcbiAgICAgIFwic2hpa2lcIixcbiAgICAgIFwidW5pZmllZFwiLFxuICAgICAgXCJ3b3JrYm94LXdpbmRvd1wiLFxuICAgICAgXCJ0ZXh0YXJlYS1tYXJrZG93bi1lZGl0b3IvZGlzdC9lc20vYm9vdHN0cmFwXCIsXG4gICAgXSxcbiAgICAvLyBkaXNhYmxlZDogZmFsc2UsXG4gIH0sXG4gIC8vIFdpbGwgYmUgcGFzc2VkIHRvIEByb2xsdXAvcGx1Z2luLWFsaWFzIGFzIGl0cyBlbnRyaWVzIG9wdGlvbi5cbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IFwiL0BzcmMvXCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiBgL3NyYy9gLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogXCJlc25leHRcIixcbiAgICBtaW5pZnk6IFwidGVyc2VyXCIsXG4gICAgLy8gRG8gbm90IHdhcm4gYWJvdXQgbGFyZ2UgY2h1bmtzXG4gICAgLy8gY2h1bmtTaXplV2FybmluZ0xpbWl0OiBJbmZpbml0eSxcbiAgICAvLyBEb3VibGUgdGhlIGRlZmF1bHQgc2l6ZSB0aHJlc2hvbGQgZm9yIGlubGluZWQgYXNzZXRzXG4gICAgLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9idWlsZC1vcHRpb25zLmh0bWwjYnVpbGQtYXNzZXRzaW5saW5lbGltaXRcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NiAqIDIsXG4gICAgLy8gY29tbW9uanNPcHRpb25zOiB7IGluY2x1ZGU6IFtdIH0sXG4gICAgLy8gcm9sbHVwT3B0aW9uczoge1xuICAgIC8vICAgZXh0ZXJuYWw6IFtcIndvcmtib3gtd2luZG93XCJdLFxuICAgIC8vIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICAvKipcbiAgICAgKiBwbHVnaW4tdnVlIHBsdWdpbiBpbmplY3QgdnVlIGxpYnJhcnkgYW5kIGFsbG93IHNmYyBmaWxlcyB0byB3b3JrICgqLnZ1ZSlcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL3RyZWUvbWFpbi9wYWNrYWdlcy9wbHVnaW4tdnVlXG4gICAgICovXG4gICAgVnVlKHtcbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC9dLFxuICAgICAgc2NyaXB0OiB7XG4gICAgICAgIGRlZmluZU1vZGVsOiB0cnVlLFxuICAgICAgICBwcm9wc0Rlc3RydWN0dXJlOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHVucGx1Z2luLXZ1ZS1pMThuIHBsdWdpbiBkb2VzIGkxOG4gcmVzb3VyY2VzIHByZS1jb21waWxhdGlvbiAvIG9wdGltaXphdGlvbnNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ludGxpZnkvYnVuZGxlLXRvb2xzL2Jsb2IvbWFpbi9wYWNrYWdlcy91bnBsdWdpbi12dWUtaTE4bi9SRUFETUUubWRcbiAgICAgKi9cbiAgICBWdWVJMThuUGx1Z2luKHtcbiAgICAgIGluY2x1ZGU6IHJlc29sdmUoXG4gICAgICAgIGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICAgXCIuL3NyYy9sb2NhbGVzLyoqXCJcbiAgICAgICksXG4gICAgICBmdWxsSW5zdGFsbDogZmFsc2UsXG4gICAgICBjb21wb3NpdGlvbk9ubHk6IHRydWUsXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB1bnBsdWdpbi12dWUtcm91dGVyIHBsdWdpbiBnZW5lcmF0ZSByb3V0ZXMgYmFzZWQgb24gZmlsZSBzeXN0ZW1cbiAgICAgKiBhbGxvdyB0byB1c2UgdHlwZWQgcm91dGVzIGFuZCB1c2FnZSBvZiBkZWZpbmVMb2FkZXJcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bvc3ZhL3VucGx1Z2luLXZ1ZS1yb3V0ZXJcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy9yZmNzL2Jsb2IvYWQ2OWRhMmFlZTkyNDJlZjg4ZjAzNjcxM2RiNjhmM2VmMjc0YmIxYi9hY3RpdmUtcmZjcy8wMDAwLXJvdXRlci11c2UtbG9hZGVyLm1kXG4gICAgICovXG4gICAgVnVlUm91dGVyKHtcbiAgICAgIHJvdXRlc0ZvbGRlcjogXCJzcmMvcGFnZXNcIixcbiAgICAgIGR0czogXCIuL3R5cGVzL3JvdXRlci5kLnRzXCIsXG5cbiAgICAgIC8qKlxuICAgICAgICogRGF0YSBGZXRjaGluZyBpcyBhbiBleHBlcmltZW50YWwgZmVhdHVyZSBmcm9tIHZ1ZSAmIHZ1ZS1yb3V0ZXJcbiAgICAgICAqXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy9yZmNzL2Rpc2N1c3Npb25zLzQ2MFxuICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcG9zdmEvdW5wbHVnaW4tdnVlLXJvdXRlci90cmVlL21haW4vc3JjL2RhdGEtZmV0Y2hpbmdcbiAgICAgICAqL1xuICAgICAgZGF0YUZldGNoaW5nOiB0cnVlLFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogVW5oZWFkIHByb3ZpZGVzIGEgVml0ZSBwbHVnaW4gdG8gb3B0aW1pc2UgeW91ciBidWlsZHMsIGJ5IHJlbW92aW5nIGNvbXBvc2FibGVzIHRoYXQgYXJlbid0IG5lZWRlZCBhbmQgc2ltcGxpZnlpbmcgeW91ciBjb2RlLlxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL3VuaGVhZC5oYXJsYW56dy5jb20vZ3VpZGUvZ2V0dGluZy1zdGFydGVkL3ZpdGUtcGx1Z2luXG4gICAgICovXG4gICAgVW5oZWFkVml0ZSgpLFxuXG4gICAgLyoqXG4gICAgICogdW5wbHVnaW4tYXV0by1pbXBvcnQgYWxsb3cgdG8gYXV0b21hdGljYWx5IGltcG9ydCBtb2R1bGVzL2NvbXBvbmVudHNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0XG4gICAgICovXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBkdHM6IFwiLi90eXBlcy9pbXBvcnRzLmQudHNcIixcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgXCJ2dWVcIixcbiAgICAgICAgXCJAdnVldXNlL2NvcmVcIixcbiAgICAgICAgVnVlUm91dGVyQXV0b0ltcG9ydHMsXG4gICAgICAgIHVuaGVhZFZ1ZUNvbXBvc2FibGVzSW1wb3J0cyxcbiAgICAgIF0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGFuIGludGVybmFsIHZpdGUgcGx1Z2luIHRoYXQgbG9hZCBtYXJrZG93biBmaWxlcyBhcyB2dWUgY29tcG9uZW50cy5cbiAgICAgKlxuICAgICAqIEBzZWUgL2RvY3VtZW50YXRpb25cbiAgICAgKiBAc2VlIC92aXRlLXBsdWdpbi12dWVyby1kb2NcbiAgICAgKiBAc2VlIC9zcmMvY29tcG9uZW50cy9wYXJ0aWFscy9kb2N1bWVudGF0aW9uL0RvY3VtZW50YXRpb25JdGVtLnZ1ZVxuICAgICAqIEBzZWUgL3NyYy9jb21wb3NhYmxlL3VzZU1hcmtkb3duVG9jLnRzXG4gICAgICovXG4gICAgVml0ZVBsdWdpblZ1ZXJvRG9jKHtcbiAgICAgIHBhdGhQcmVmaXg6IFwiZG9jdW1lbnRhdGlvblwiLFxuICAgICAgd3JhcHBlckNvbXBvbmVudDogXCJEb2N1bWVudGF0aW9uSXRlbVwiLFxuICAgICAgc2hpa2k6IHtcbiAgICAgICAgdGhlbWU6IHtcbiAgICAgICAgICBsaWdodDogXCJtaW4tbGlnaHRcIixcbiAgICAgICAgICBkYXJrOiBcImdpdGh1Yi1kYXJrXCIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc291cmNlTWV0YToge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBlZGl0UHJvdG9jb2w6IFwidnNjb2RlOi8vdnNjb2RlLXJlbW90ZS93c2wrVWJ1bnR1XCIsIC8vIG9yICd2c2NvZGU6Ly9maWxlJ1xuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgYW4gaW50ZXJuYWwgdml0ZSBwbHVnaW4gdGhhdCByZW1vdmUgaHRtbCBjb21tZW50cyBmcm9tIGNvZGUuXG4gICAgICpcbiAgICAgKiBAc2VlIC92aXRlLXBsdWdpbi1wdXJnZS1jb21tZW50c1xuICAgICAqL1xuICAgIFZpdGVQbHVnaW5QdXJnZUNvbW1lbnRzKCksXG5cbiAgICAvKipcbiAgICAgKiB1bnBsdWdpbi12dWUtY29tcG9uZW50cyBwbHVnaW4gaXMgcmVzcG9uc2libGUgb2YgYXV0b2xvYWRpbmcgY29tcG9uZW50c1xuICAgICAqIGRvY3VtZW50YXRpb24gYW5kIG1kIGZpbGUgYXJlIGxvYWRlZCBmb3IgZWxlbWVudHMgYW5kIGNvbXBvbmVudHMgc2VjdGlvbnNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzXG4gICAgICovXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkaXJzOiBbXCJkb2N1bWVudGF0aW9uXCIsIFwic3JjL2NvbXBvbmVudHNcIiwgXCJzcmMvbGF5b3V0c1wiXSxcbiAgICAgIGV4dGVuc2lvbnM6IFtcInZ1ZVwiLCBcIm1kXCJdLFxuICAgICAgZHRzOiBcIi4vdHlwZXMvY29tcG9uZW50cy5kLnRzXCIsXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdml0ZS1wbHVnaW4tcHVyZ2UtaWNvbnMgcGx1Z2luIGlzIHJlc3BvbnNpYmxlIG9mIGF1dG9sb2FkaW5nIGljb25lcyBmcm9tIG11bHRpcGxlcyBwcm92aWRlcnNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9pY29uZXMubmV0bGlmeS5hcHAvXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvcHVyZ2UtaWNvbnMvdHJlZS9tYWluL3BhY2thZ2VzL3ZpdGUtcGx1Z2luLXB1cmdlLWljb25zXG4gICAgICovXG4gICAgUHVyZ2VJY29ucygpLFxuXG4gICAgLyoqXG4gICAgICogdml0ZS1wbHVnaW4tZm9udHMgcGx1Z2luIGluamVjdCB3ZWJmb250cyBmcm9tIGRpZmZlcmVudHMgcHJvdmlkZXJzXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zdGFmeW5pYWtzYWNoYS92aXRlLXBsdWdpbi1mb250c1xuICAgICAqL1xuICAgIFVuZm9udHMoe1xuICAgICAgZ29vZ2xlOiB7XG4gICAgICAgIGZhbWlsaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJGaXJhIENvZGVcIixcbiAgICAgICAgICAgIHN0eWxlczogXCJ3Z2h0QDQwMDs2MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiTW9udHNlcnJhdFwiLFxuICAgICAgICAgICAgc3R5bGVzOiBcIndnaHRANTAwOzYwMDs3MDA7ODAwOzkwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJSb2JvdG9cIixcbiAgICAgICAgICAgIHN0eWxlczogXCJ3Z2h0QDMwMDs0MDA7NTAwOzYwMDs3MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHZpdGUtcGx1Z2luLXJhZGFyIHBsdWdpbiBpbmplY3Qgc25pcHBldHMgZnJvbSBhbmFseXRpY3MgcHJvdmlkZXJzXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zdGFmeW5pYWtzYWNoYS92aXRlLXBsdWdpbi1yYWRhclxuICAgICAqL1xuICAgICFwcm9jZXNzLmVudi5HVE1fSURcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IFZpdGVQbHVnaW5SYWRhcih7XG4gICAgICAgICAgZ3RtOiB7XG4gICAgICAgICAgICBpZDogcHJvY2Vzcy5lbnYuR1RNX0lELFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdml0ZS1wbHVnaW4tcHdhIGdlbmVyYXRlIG1hbmlmZXN0Lmpzb24gYW5kIHJlZ2lzdGVyIHNlcnZpY2VzIHdvcmtlciB0byBlbmFibGUgUFdBXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS92aXRlLXBsdWdpbi1wd2FcbiAgICAgKi9cbiAgICBWaXRlUFdBKHtcbiAgICAgIGJhc2U6IFwiL1wiLFxuICAgICAgaW5jbHVkZUFzc2V0czogW1xuICAgICAgICBcImZhdmljb24uc3ZnXCIsXG4gICAgICAgIFwiZmF2aWNvbi5pY29cIixcbiAgICAgICAgXCJyb2JvdHMudHh0XCIsXG4gICAgICAgIFwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIixcbiAgICAgIF0sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiBcIkliZXggLSBSZWFsLUVzdGF0ZSBCdWlsZGVyc1wiLFxuICAgICAgICBzaG9ydF9uYW1lOiBcIkliZXhcIixcbiAgICAgICAgc3RhcnRfdXJsOiBcIi8/dXRtX3NvdXJjZT1wd2FcIixcbiAgICAgICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXG4gICAgICAgIHRoZW1lX2NvbG9yOiBcIiNmZmZmZmZcIixcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcInB3YS0xOTJ4MTkyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJwd2EtNTEyeDUxMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwicHdhLTUxMng1MTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgICAgcHVycG9zZTogXCJhbnkgbWFza2FibGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIG1vZGU6IGlzUHJvZCA/IFwicHJvZHVjdGlvblwiIDogXCJkZXZlbG9wbWVudFwiLFxuICAgICAgLy8gcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBwcmVjYWNoZSBmaWxlcyB0aGF0IG1hdGNoIHRoZSBnbG9iIHBhdHRlcm5cbiAgICAgICAgICpcbiAgICAgICAgICogQHNlZSBodHRwczovL3ZpdGUtcHdhLW9yZy5uZXRsaWZ5LmFwcC9ndWlkZS9zZXJ2aWNlLXdvcmtlci1wcmVjYWNoZS5odG1sXG4gICAgICAgICAqL1xuICAgICAgICBnbG9iUGF0dGVybnM6IFtcIioqLyoue2pzLGNzcyxpY28scG5nLHN2Zyx3ZWJwLGpwZyxqcGVnfVwiXSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogYWRkIGV4dGVybmFsIGNhY2hlIG9mIGdvb2dsZSBmb250c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAc2VlIGh0dHBzOi8vdml0ZS1wd2Etb3JnLm5ldGxpZnkuYXBwL3dvcmtib3gvZ2VuZXJhdGUtc3cuaHRtbFxuICAgICAgICAgKi9cbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ZvbnRzXFwuZ29vZ2xlYXBpc1xcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiBcIkNhY2hlRmlyc3RcIixcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcImdvb2dsZS1mb250cy1jYWNoZVwiLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAsXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1LCAvLyA8PT0gMzY1IGRheXNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdzdGF0aWNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogXCJDYWNoZUZpcnN0XCIsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogXCJnc3RhdGljLWZvbnRzLWNhY2hlXCIsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUsIC8vIDw9PSAzNjUgZGF5c1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiByb2xsdXAtcGx1Z2luLXB1cmdlY3NzIHBsdWdpbiBpcyByZXNwb25zaWJsZSBvZiBwdXJnaW5nIGNzcyBydWxlc1xuICAgICAqIHRoYXQgYXJlIG5vdCB1c2VkIGluIHRoZSBidW5kbGVcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL0Z1bGxIdW1hbi9wdXJnZWNzcy90cmVlL21haW4vcGFja2FnZXMvcm9sbHVwLXBsdWdpbi1wdXJnZWNzc1xuICAgICAqL1xuICAgIHB1cmdlY3NzKHtcbiAgICAgIG91dHB1dDogZmFsc2UsXG4gICAgICBjb250ZW50OiBbYC4vc3JjLyoqLyoudnVlYF0sXG4gICAgICB2YXJpYWJsZXM6IGZhbHNlLFxuICAgICAgc2FmZWxpc3Q6IHtcbiAgICAgICAgc3RhbmRhcmQ6IFtcbiAgICAgICAgICAvKGF1dHZ8bG5pbHxsbmlyfGZhcz8pLyxcbiAgICAgICAgICAvLShsZWF2ZXxlbnRlcnxhcHBlYXIpKHwtKHRvfGZyb218YWN0aXZlKSkkLyxcbiAgICAgICAgICAvXig/ISh8Lio/OiljdXJzb3ItbW92ZSkuKy1tb3ZlJC8sXG4gICAgICAgICAgL15yb3V0ZXItbGluayh8LWV4YWN0KS1hY3RpdmUkLyxcbiAgICAgICAgICAvZGF0YS12LS4qLyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0RXh0cmFjdG9yKGNvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29udGVudFdpdGhvdXRTdHlsZUJsb2NrcyA9IGNvbnRlbnQucmVwbGFjZShcbiAgICAgICAgICAvPHN0eWxlW15dKz88XFwvc3R5bGU+L2dpLFxuICAgICAgICAgIFwiXCJcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBjb250ZW50V2l0aG91dFN0eWxlQmxvY2tzLm1hdGNoKC9bQS1aYS16MC05LV8vOl0qW0EtWmEtejAtOS1fL10rL2cpIHx8XG4gICAgICAgICAgW11cbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB2aXRlLXBsdWdpbi1pbWFnZW1pbiBvcHRpbWl6ZSBhbGwgaW1hZ2VzIHNpemVzIGZyb20gcHVibGljIG9yIGFzc2V0IGZvbGRlclxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5uY3diL3ZpdGUtcGx1Z2luLWltYWdlbWluXG4gICAgICovXG4gICAgIU1JTklGWV9JTUFHRVNcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IEltYWdlTWluKHtcbiAgICAgICAgICBnaWZzaWNsZToge1xuICAgICAgICAgICAgb3B0aW1pemF0aW9uTGV2ZWw6IDcsXG4gICAgICAgICAgICBpbnRlcmxhY2VkOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9wdGlwbmc6IHtcbiAgICAgICAgICAgIG9wdGltaXphdGlvbkxldmVsOiA3LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW96anBlZzoge1xuICAgICAgICAgICAgcXVhbGl0eTogNjAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwbmdxdWFudDoge1xuICAgICAgICAgICAgcXVhbGl0eTogWzAuOCwgMC45XSxcbiAgICAgICAgICAgIHNwZWVkOiA0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3Znbzoge1xuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJyZW1vdmVWaWV3Qm94XCIsXG4gICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwicmVtb3ZlRW1wdHlBdHRyc1wiLFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICBdLFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2Rldi9NdXNpYy9OZXdGb2xkZXIvTXlXb3JrU3BhY2UvSWJleFdvcmtodWJQcm8vdml0ZS1wbHVnaW4tdnVlcm8tZG9jXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9pbmRleC50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luLCBSZXNvbHZlZENvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdHlwZSB7IFByb2Nlc3NvciB9IGZyb20gJ3VuaWZpZWQnXG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAnc2hpa2knXG5cbmltcG9ydCB7IGpvaW4sIGJhc2VuYW1lIH0gZnJvbSAncGF0aGUnXG5pbXBvcnQgeyBjb21waWxlVGVtcGxhdGUsIHBhcnNlIH0gZnJvbSAnQHZ1ZS9jb21waWxlci1zZmMnXG5cbmltcG9ydCB7IGNyZWF0ZVByb2Nlc3NvcnMgfSBmcm9tICcuL21hcmtkb3duJ1xuaW1wb3J0IHsgdHJhbnNmb3JtRXhhbXBsZU1hcmt1cCwgdHJhbnNmb3JtU2xvdHMgfSBmcm9tICcuL3RyYW5zZm9ybSdcblxuZnVuY3Rpb24gcGFyc2VJZChpZDogc3RyaW5nKSB7XG4gIGNvbnN0IGluZGV4ID0gaWQuaW5kZXhPZignPycpXG4gIGlmIChpbmRleCA8IDApIHJldHVybiBpZFxuICBlbHNlIHJldHVybiBpZC5zbGljZSgwLCBpbmRleClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQbHVnaW5PcHRpb25zIHtcbiAgcGF0aFByZWZpeD86IHN0cmluZ1xuICB3cmFwcGVyQ29tcG9uZW50OiBzdHJpbmdcbiAgc2hpa2k6IHtcbiAgICB0aGVtZTpcbiAgICAgIHwgVGhlbWVcbiAgICAgIHwge1xuICAgICAgICAgIGxpZ2h0OiBUaGVtZVxuICAgICAgICAgIGRhcms6IFRoZW1lXG4gICAgICAgIH1cbiAgfVxuICBzb3VyY2VNZXRhPzoge1xuICAgIGVuYWJsZWQ/OiBib29sZWFuXG4gICAgZWRpdFByb3RvY29sPzogc3RyaW5nXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZpdGVQbHVnaW5WdWVyb0RvYyhvcHRpb25zOiBQbHVnaW5PcHRpb25zKSB7XG4gIGxldCBjb25maWc6IFJlc29sdmVkQ29uZmlnIHwgdW5kZWZpbmVkXG4gIGxldCBwcm9jZXNzb3JzOiB7IGxpZ2h0OiBQcm9jZXNzb3I7IGRhcms6IFByb2Nlc3NvciB9IHwgdW5kZWZpbmVkXG5cbiAgY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKVxuICBjb25zdCBwYXRoUHJlZml4ID0gb3B0aW9ucy5wYXRoUHJlZml4ID8gam9pbihjd2QsIG9wdGlvbnMucGF0aFByZWZpeCkgOiBjd2RcblxuICBhc3luYyBmdW5jdGlvbiBtYXJrZG93blRvVnVlKGlkOiBzdHJpbmcsIHJhdzogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0aCA9IHBhcnNlSWQoaWQpXG5cbiAgICAvLyB0cmFuc2Zvcm0gZXhhbXBsZSBtYXJrdXAgdG8gdXNlIGtlYmFiLWNhc2Ugd2l0aG91dCBzZWxmLWNsb3NpbmcgZWxlbWVudHMuXG4gICAgLy8gdGhpcyBpcyBuZWVkZWQgYmVjYXVzZSByZWh5cGUtcmF3IHJlcXVpcmVzIHZhbGlkIGh0bWwgKG9ubHkgc29tZSB0YWdzIGFyZSBzZWxmLWNsb3NhYmxlKVxuICAgIGNvbnN0IGlucHV0ID0gdHJhbnNmb3JtRXhhbXBsZU1hcmt1cChyYXcpXG5cbiAgICAvLyBwcm9jZXNzIG1hcmtkb3duIHdpdGggcmVtYXJrXG4gICAgaWYgKCFwcm9jZXNzb3JzKSBwcm9jZXNzb3JzID0gYXdhaXQgY3JlYXRlUHJvY2Vzc29ycyhvcHRpb25zLnNoaWtpLnRoZW1lKVxuXG4gICAgY29uc3QgW3ZGaWxlTGlnaHQsIHZGaWxlRGFya10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBwcm9jZXNzb3JzLmxpZ2h0LnByb2Nlc3MoaW5wdXQpLFxuICAgICAgcHJvY2Vzc29ycy5kYXJrLnByb2Nlc3MoaW5wdXQpLFxuICAgIF0pXG5cbiAgICBjb25zdCBjb250ZW50TGlnaHQgPSB2RmlsZUxpZ2h0LnRvU3RyaW5nKClcbiAgICBjb25zdCBjb250ZW50RGFyayA9IHZGaWxlRGFyay50b1N0cmluZygpXG4gICAgY29uc3QgZnJvbnRtYXR0ZXIgPSB2RmlsZUxpZ2h0LmRhdGE/LmZyb250bWF0dGVyID8/IHt9XG5cbiAgICAvLyByZXBsYWNlIGNvZGUvZXhhbXBsZSBzbG90cyBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBzbG90TGlnaHQgPSB0cmFuc2Zvcm1TbG90cyhjb250ZW50TGlnaHQsICd2LWlmPVwiIWRhcmttb2RlLmlzRGFya1wiJylcbiAgICBjb25zdCBzbG90RGFyayA9IHRyYW5zZm9ybVNsb3RzKGNvbnRlbnREYXJrLCAndi1pZj1cImRhcmttb2RlLmlzRGFya1wiJylcblxuICAgIC8vIHdyYXAgY29udGVudCBpbiB3cmFwcGVyIGNvbXBvbmVudCBkZWZhdWx0IHNsb3RcbiAgICBjb25zdCBzZmMgPSBbXG4gICAgICBgPHRlbXBsYXRlPmAsXG4gICAgICBgICA8JHtvcHRpb25zLndyYXBwZXJDb21wb25lbnR9IDpmcm9udG1hdHRlcj1cImZyb250bWF0dGVyXCIgOnNvdXJjZS1tZXRhPVwic291cmNlTWV0YVwiPmAsXG4gICAgICBgICAgICR7c2xvdExpZ2h0fWAsXG4gICAgICBgICAgICR7c2xvdERhcmt9YCxcbiAgICAgIGAgIDwvJHtvcHRpb25zLndyYXBwZXJDb21wb25lbnR9PmAsXG4gICAgICBgPC90ZW1wbGF0ZT5gLFxuICAgIF0uam9pbignXFxuJylcblxuICAgIC8vIHBhcnNlIHRlbXBsYXRlIHdpdGggdnVlIHNmYyBjb21waWxlclxuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlKHNmYywge1xuICAgICAgZmlsZW5hbWU6IHBhdGgsXG4gICAgICBzb3VyY2VNYXA6IHRydWUsXG4gICAgfSlcblxuICAgIGlmIChyZXN1bHQuZXJyb3JzLmxlbmd0aCB8fCByZXN1bHQuZGVzY3JpcHRvci50ZW1wbGF0ZSA9PT0gbnVsbCkge1xuICAgICAgY29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3JzKVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcmtkb3duOiB1bmFibGUgdG8gcGFyc2UgdmlydHVhbCBmaWxlIGdlbmVyYXRlZCBmb3IgXCIke2lkfVwiYClcbiAgICB9XG5cbiAgICAvLyBjb21waWxlIHRlbXBsYXRlIHdpdGggdnVlIHNmYyBjb21waWxlclxuICAgIGNvbnN0IHsgY29kZSwgZXJyb3JzIH0gPSBjb21waWxlVGVtcGxhdGUoe1xuICAgICAgZmlsZW5hbWU6IHBhdGgsXG4gICAgICBpZDogcGF0aCxcbiAgICAgIHNvdXJjZTogcmVzdWx0LmRlc2NyaXB0b3IudGVtcGxhdGUuY29udGVudCxcbiAgICAgIHByZXByb2Nlc3NMYW5nOiByZXN1bHQuZGVzY3JpcHRvci50ZW1wbGF0ZS5sYW5nLFxuICAgICAgdHJhbnNmb3JtQXNzZXRVcmxzOiBmYWxzZSxcbiAgICB9KVxuXG4gICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JzKVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcmtkb3duOiB1bmFibGUgdG8gY29tcGlsZSB2aXJ0dWFsIGZpbGUgXCIke2lkfVwiYClcbiAgICB9XG5cbiAgICAvLyBzb3VyY2UgaXMgdXNlZCB0byBkaXNwbGF5IGVkaXQgc291cmNlIGxpbmsgaW4gdGhlIGRvY3NcbiAgICBsZXQgc291cmNlTWV0YSA9ICd1bmRlZmluZWQnXG4gICAgaWYgKG9wdGlvbnMuc291cmNlTWV0YT8uZW5hYmxlZCkge1xuICAgICAgc291cmNlTWV0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgcmVsYXRpdmVQYXRoOiBwYXRoLnN1YnN0cmluZyhjd2QubGVuZ3RoKSxcbiAgICAgICAgYmFzZW5hbWU6IGJhc2VuYW1lKHBhdGgpLFxuICAgICAgICBwYXRoOiBjb25maWc/LmlzUHJvZHVjdGlvbiA/ICcnIDogcGF0aCxcbiAgICAgICAgZWRpdFByb3RvY29sOiBjb25maWc/LmlzUHJvZHVjdGlvbiA/ICcnIDogb3B0aW9ucy5zb3VyY2VNZXRhLmVkaXRQcm90b2NvbCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gaW5qZWN0IGZyb250bWF0dGVyL2Rhcmttb2RlIGFuZCBobXJJZCBpbnRvIHRoZSBjb21waWxlZCByZW5kZXIgZnVuY3Rpb25cbiAgICBjb25zdCBvdXRwdXQgPSBbXG4gICAgICBgaW1wb3J0IHsgcmVhY3RpdmUgfSBmcm9tICd2dWUnYCxcbiAgICAgIGBpbXBvcnQgeyB1c2VEYXJrbW9kZSB9IGZyb20gJy9Ac3JjL3N0b3Jlcy9kYXJrbW9kZSdgLFxuXG4gICAgICBjb2RlLnJlcGxhY2UoJ2V4cG9ydCBmdW5jdGlvbiByZW5kZXInLCAnZnVuY3Rpb24gcmVuZGVyJyksXG5cbiAgICAgIGBjb25zdCBfX2Zyb250bWF0dGVyID0gJHtKU09OLnN0cmluZ2lmeShmcm9udG1hdHRlcil9O2AsXG4gICAgICBgY29uc3Qgc2V0dXAgPSAoKSA9PiAoe2AsXG4gICAgICBgICBmcm9udG1hdHRlcjogcmVhY3RpdmUoX19mcm9udG1hdHRlciksYCxcbiAgICAgIGAgIGRhcmttb2RlOiB1c2VEYXJrbW9kZSgpLGAsXG4gICAgICBgICBzb3VyY2VNZXRhOiAke3NvdXJjZU1ldGF9LGAsXG4gICAgICBgfSk7YCxcbiAgICAgIGBjb25zdCBfX3NjcmlwdCA9IHsgcmVuZGVyLCBzZXR1cCB9O2AsXG5cbiAgICAgIGNvbmZpZz8uaXNQcm9kdWN0aW9uID8gJycgOiBgX19zY3JpcHQuX19obXJJZCA9ICR7SlNPTi5zdHJpbmdpZnkocGF0aCl9O2AsXG4gICAgICBgZXhwb3J0IGRlZmF1bHQgX19zY3JpcHQ7YCxcbiAgICBdLmpvaW4oJ1xcbicpXG5cbiAgICByZXR1cm4gb3V0cHV0XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi12dWVyby1kb2MnLFxuICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgIGNvbmZpZ1Jlc29sdmVkKF9jb25maWcpIHtcbiAgICAgIGNvbmZpZyA9IF9jb25maWdcbiAgICB9LFxuICAgIGFzeW5jIHRyYW5zZm9ybShyYXcsIGlkKSB7XG4gICAgICBpZiAoaWQuZW5kc1dpdGgoJy5tZCcpICYmIGlkLnN0YXJ0c1dpdGgocGF0aFByZWZpeCkpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IG1hcmtkb3duVG9WdWUoaWQsIHJhdylcbiAgICAgIH1cbiAgICB9LFxuICB9IHNhdGlzZmllcyBQbHVnaW5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVml0ZVBsdWdpblZ1ZXJvRG9jXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2Rldi9NdXNpYy9OZXdGb2xkZXIvTXlXb3JrU3BhY2UvSWJleFdvcmtodWJQcm8vdml0ZS1wbHVnaW4tdnVlcm8tZG9jXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9tYXJrZG93bi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9tYXJrZG93bi50c1wiO2ltcG9ydCB5YW1sIGZyb20gJ2pzLXlhbWwnXG5pbXBvcnQgcmVtYXJrU2hpa2kgZnJvbSAnQHN0ZWZhbnByb2JzdC9yZW1hcmstc2hpa2knXG5pbXBvcnQgcmVoeXBlRXh0ZXJuYWxMaW5rcyBmcm9tICdyZWh5cGUtZXh0ZXJuYWwtbGlua3MnXG5pbXBvcnQgcmVoeXBlUmF3IGZyb20gJ3JlaHlwZS1yYXcnXG5pbXBvcnQgcmVoeXBlU2x1ZyBmcm9tICdyZWh5cGUtc2x1ZydcbmltcG9ydCByZWh5cGVBdXRvbGlua0hlYWRpbmdzIGZyb20gJ3JlaHlwZS1hdXRvbGluay1oZWFkaW5ncydcbmltcG9ydCByZWh5cGVTdHJpbmdpZnkgZnJvbSAncmVoeXBlLXN0cmluZ2lmeSdcbmltcG9ydCByZW1hcmtQYXJzZSBmcm9tICdyZW1hcmstcGFyc2UnXG5pbXBvcnQgcmVtYXJrR2ZtIGZyb20gJ3JlbWFyay1nZm0nXG5pbXBvcnQgcmVtYXJrUmVoeXBlIGZyb20gJ3JlbWFyay1yZWh5cGUnXG5pbXBvcnQgcmVtYXJrRnJvbnRtYXR0ZXIgZnJvbSAncmVtYXJrLWZyb250bWF0dGVyJ1xuaW1wb3J0IHsgZ2V0SGlnaGxpZ2h0ZXIsIHR5cGUgSVRoZW1lUmVnaXN0cmF0aW9uLCB0eXBlIExhbmcsIHR5cGUgVGhlbWUgfSBmcm9tICdzaGlraSdcbmltcG9ydCB7IHVuaWZpZWQsIHR5cGUgUHJvY2Vzc29yIH0gZnJvbSAndW5pZmllZCdcblxuY29uc3QgbGFuZ3MgPSBbJ3Z1ZScsICd2dWUtaHRtbCcsICd0eXBlc2NyaXB0JywgJ2Jhc2gnLCAnc2NzcyddIHNhdGlzZmllcyBMYW5nW11cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVByb2Nlc3Nvcih0aGVtZTogSVRoZW1lUmVnaXN0cmF0aW9uKTogUHJvbWlzZTxQcm9jZXNzb3I+IHtcbiAgY29uc3QgaGlnaGxpZ2h0ZXIgPSBhd2FpdCBnZXRIaWdobGlnaHRlcih7XG4gICAgdGhlbWUsXG4gICAgbGFuZ3MsXG4gIH0pXG5cbiAgcmV0dXJuIHVuaWZpZWQoKVxuICAgIC51c2UocmVtYXJrUGFyc2UpXG4gICAgLnVzZShyZW1hcmtGcm9udG1hdHRlcilcbiAgICAudXNlKCgpID0+ICh0cmVlLCBmaWxlKSA9PiB7XG4gICAgICBpZiAodHJlZS5jaGlsZHJlblswXS50eXBlID09PSAneWFtbCcpIHtcbiAgICAgICAgLy8gc3RvcmUgZnJvbnRtYXR0ZXIgaW4gdmZpbGVcbiAgICAgICAgZmlsZS5kYXRhLmZyb250bWF0dGVyID0geWFtbC5sb2FkKHRyZWUuY2hpbGRyZW5bMF0udmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgICAudXNlKHJlbWFya0dmbSlcbiAgICAudXNlKHJlbWFya1NoaWtpLCB7IGhpZ2hsaWdodGVyIH0pXG4gICAgLnVzZShyZW1hcmtSZWh5cGUsIHsgYWxsb3dEYW5nZXJvdXNIdG1sOiB0cnVlIH0pXG4gICAgLnVzZShyZWh5cGVSYXcpXG4gICAgLnVzZShyZWh5cGVFeHRlcm5hbExpbmtzLCB7IHJlbDogWydub2ZvbGxvdyddLCB0YXJnZXQ6ICdfYmxhbmsnIH0pXG4gICAgLnVzZShyZWh5cGVTbHVnKVxuICAgIC51c2UocmVoeXBlQXV0b2xpbmtIZWFkaW5ncywge1xuICAgICAgYmVoYXZpb3I6ICdhcHBlbmQnLFxuICAgICAgY29udGVudDoge1xuICAgICAgICB0eXBlOiAnZWxlbWVudCcsXG4gICAgICAgIHRhZ05hbWU6ICdpJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGNsYXNzTmFtZTogWydpY29uaWZ5IHRvYy1saW5rLWFuY2hvciddLFxuICAgICAgICAgIGRhdGFJY29uOiAnZmVhdGhlcjpsaW5rJyxcbiAgICAgICAgfSxcbiAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgfSxcbiAgICAgIHRlc3Q6IChub2RlKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBBcnJheS5pc0FycmF5KG5vZGUucHJvcGVydGllcz8uY2xhc3NOYW1lKSAmJlxuICAgICAgICAgIG5vZGUucHJvcGVydGllcz8uY2xhc3NOYW1lPy5pbmNsdWRlcygndG9jLWlnbm9yZScpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBCb29sZWFuKG5vZGUucHJvcGVydGllcz8uaWQpXG4gICAgICB9LFxuICAgIH0pXG4gICAgLnVzZShyZWh5cGVTdHJpbmdpZnkpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQcm9jZXNzb3JzKFxuICB0aGVtZTpcbiAgICB8IFRoZW1lXG4gICAgfCB7XG4gICAgICAgIGxpZ2h0OiBUaGVtZVxuICAgICAgICBkYXJrOiBUaGVtZVxuICAgICAgfVxuKTogUHJvbWlzZTx7IGxpZ2h0OiBQcm9jZXNzb3I7IGRhcms6IFByb2Nlc3NvciB9PiB7XG4gIHJldHVybiB7XG4gICAgbGlnaHQ6IGF3YWl0IGNyZWF0ZVByb2Nlc3Nvcih0eXBlb2YgdGhlbWUgPT09ICdzdHJpbmcnID8gdGhlbWUgOiB0aGVtZS5saWdodCksXG4gICAgZGFyazogYXdhaXQgY3JlYXRlUHJvY2Vzc29yKHR5cGVvZiB0aGVtZSA9PT0gJ3N0cmluZycgPyB0aGVtZSA6IHRoZW1lLmRhcmspLFxuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2Rldi9NdXNpYy9OZXdGb2xkZXIvTXlXb3JrU3BhY2UvSWJleFdvcmtodWJQcm8vdml0ZS1wbHVnaW4tdnVlcm8tZG9jXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy90cmFuc2Zvcm0udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzXCI7aW1wb3J0IHsga2ViYWJDYXNlIH0gZnJvbSAnc2N1bGUnXG5cbmNvbnN0IFNFTEZfQ0xPU0lOR19UQUdfUkVHRVggPSAvPChbXlxccz48L10rKShbXj5dKylcXC8+L2dcbmNvbnN0IE9QRU5fVEFHX1JFR0VYID0gLzwoW15cXHM+PC9dKykvZ1xuY29uc3QgQ0xPU0VfVEFHX1JFR0VYID0gLzxcXC8oW15cXHM+PC9dKykvZ1xuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtRXhhbXBsZU1hcmt1cChyYXc6IHN0cmluZykge1xuICBsZXQgb3V0cHV0ID0gcmF3XG4gIGxldCBjb250ZW50OiBSZWdFeHBNYXRjaEFycmF5IHwgbnVsbCA9IG51bGxcbiAgaWYgKChjb250ZW50ID0gcmF3Lm1hdGNoKC88IS0tZXhhbXBsZS0tPihbXFxzXFxTXSo/KTwhLS1cXC9leGFtcGxlLS0+LykpKSB7XG4gICAgY29uc3Qga2ViYWJDb250ZW50ID0gY29udGVudFsxXVxuICAgICAgLnJlcGxhY2VBbGwoU0VMRl9DTE9TSU5HX1RBR19SRUdFWCwgKHN1YnN0cmluZywgdGFnKSA9PiB7XG4gICAgICAgIHJldHVybiBzdWJzdHJpbmcucmVwbGFjZSgnLz4nLCBgPjwvJHt0YWcudHJpbSgpfT5gKVxuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlQWxsKE9QRU5fVEFHX1JFR0VYLCAoc3Vic3RyaW5nKSA9PiB7XG4gICAgICAgIHJldHVybiBgPCR7a2ViYWJDYXNlKHN1YnN0cmluZy5zdWJzdHJpbmcoMSkudHJpbSgpKX1gXG4gICAgICB9KVxuICAgICAgLnJlcGxhY2VBbGwoQ0xPU0VfVEFHX1JFR0VYLCAoc3Vic3RyaW5nKSA9PiB7XG4gICAgICAgIHJldHVybiBgPC8ke2tlYmFiQ2FzZShzdWJzdHJpbmcuc3Vic3RyaW5nKDIpLnRyaW0oKSl9YFxuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlQWxsKCcmI3gyNzsnLCBcIidcIilcblxuICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKGNvbnRlbnRbMV0sIGtlYmFiQ29udGVudClcbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybVNsb3RzKHNvdXJjZTogc3RyaW5nLCBjb25kaXRpb246IHN0cmluZyA9ICcnKSB7XG4gIGlmIChzb3VyY2UuaW5jbHVkZXMoJzwhLS1jb2RlLS0+JykgJiYgc291cmNlLmluY2x1ZGVzKCc8IS0tZXhhbXBsZS0tPicpKSB7XG4gICAgcmV0dXJuIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNkZWZhdWx0PiR7c291cmNlfWBcbiAgICAgIC5yZXBsYWNlKFxuICAgICAgICBgPCEtLWNvZGUtLT5gLFxuICAgICAgICBgPC90ZW1wbGF0ZT48dGVtcGxhdGUgJHtjb25kaXRpb259ICNjb2RlPlxcbjxzbG90IG5hbWU9XCJjb2RlXCI+PGRpdiB2LXByZT5gXG4gICAgICApXG4gICAgICAucmVwbGFjZShgPCEtLS9jb2RlLS0+YCwgYDwvZGl2Pjwvc2xvdD5cXG48L3RlbXBsYXRlPmApXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS1leGFtcGxlLS0+YCxcbiAgICAgICAgYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2V4YW1wbGU+XFxuPHNsb3QgbmFtZT1cImV4YW1wbGVcIj5gXG4gICAgICApXG4gICAgICAucmVwbGFjZShgPCEtLS9leGFtcGxlLS0+YCwgYDwvc2xvdD5cXG48L3RlbXBsYXRlPmApXG4gIH1cblxuICBpZiAoc291cmNlLmluY2x1ZGVzKCc8IS0tY29kZS0tPicpKSB7XG4gICAgcmV0dXJuIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNkZWZhdWx0PiR7c291cmNlfWBcbiAgICAgIC5yZXBsYWNlKFxuICAgICAgICBgPCEtLWNvZGUtLT5gLFxuICAgICAgICBgPC90ZW1wbGF0ZT48dGVtcGxhdGUgJHtjb25kaXRpb259ICNjb2RlPlxcbjxzbG90IG5hbWU9XCJjb2RlXCI+PGRpdiB2LXByZT5gXG4gICAgICApXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS0vY29kZS0tPmAsXG4gICAgICAgIGA8L2Rpdj48L3Nsb3Q+XFxuPC90ZW1wbGF0ZT5cXG48dGVtcGxhdGUgJHtjb25kaXRpb259ICNleGFtcGxlPjxzbG90IG5hbWU9XCJleGFtcGxlXCI+PC9zbG90PjwvdGVtcGxhdGU+YFxuICAgICAgKVxuICB9XG5cbiAgaWYgKHNvdXJjZS5pbmNsdWRlcygnPCEtLWV4YW1wbGUtLT4nKSkge1xuICAgIHJldHVybiBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZGVmYXVsdD4ke3NvdXJjZX1gXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS1leGFtcGxlLS0+YCxcbiAgICAgICAgYDwvdGVtcGxhdGU+PHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZXhhbXBsZT5cXG48c2xvdCBuYW1lPVwiZXhhbXBsZVwiPmBcbiAgICAgIClcbiAgICAgIC5yZXBsYWNlKFxuICAgICAgICBgPCEtLS9leGFtcGxlLS0+YCxcbiAgICAgICAgYDwvc2xvdD5cXG48L3RlbXBsYXRlPlxcbjx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2NvZGU+PHNsb3QgbmFtZT1cImNvZGVcIj48L3Nsb3Q+PC90ZW1wbGF0ZT5gXG4gICAgICApXG4gIH1cblxuICByZXR1cm4gKFxuICAgIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNkZWZhdWx0PiR7c291cmNlfTwvdGVtcGxhdGU+YCArXG4gICAgYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2V4YW1wbGU+PHNsb3QgbmFtZT1cImV4YW1wbGVcIj48L3Nsb3Q+PC90ZW1wbGF0ZT5gICtcbiAgICBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjY29kZT48c2xvdCBuYW1lPVwiY29kZVwiPjwvc2xvdD48L3RlbXBsYXRlPmBcbiAgKVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rldi9NdXNpYy9OZXdGb2xkZXIvTXlXb3JrU3BhY2UvSWJleFdvcmtodWJQcm8vdml0ZS1wbHVnaW4tcHVyZ2UtY29tbWVudHMvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgTWFnaWNTdHJpbmcgZnJvbSAnbWFnaWMtc3RyaW5nJ1xuXG5mdW5jdGlvbiBwYXJzZUlkKGlkOiBzdHJpbmcpIHtcbiAgY29uc3QgaW5kZXggPSBpZC5pbmRleE9mKCc/JylcbiAgaWYgKGluZGV4IDwgMCkgcmV0dXJuIGlkXG4gIGVsc2UgcmV0dXJuIGlkLnNsaWNlKDAsIGluZGV4KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBsdWdpbk9wdGlvbnMge1xuICBzb3VyY2VtYXA/OiBib29sZWFuXG59XG5cbi8qKlxuICogVGhpcyBwbHVnaW4gcmVtb3ZlcyBIVE1MIGNvbW1lbnRzIGZyb20geW91ciBjb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gVml0ZVBsdWdpblB1cmdlQ29tbWVudHMoeyBzb3VyY2VtYXAgPSBmYWxzZSB9OiBQbHVnaW5PcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAncHVyZ2UtY29tbWVudHMnLFxuICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgIHRyYW5zZm9ybTogKGNvZGUsIGlkKSA9PiB7XG4gICAgICBjb25zdCBwYXJzZWRJZCA9IHBhcnNlSWQoaWQpXG4gICAgICBpZiAoXG4gICAgICAgICEoXG4gICAgICAgICAgcGFyc2VkSWQuZW5kc1dpdGgoJy52dWUnKSB8fFxuICAgICAgICAgIHBhcnNlZElkLmVuZHNXaXRoKCcuaHRtbCcpIHx8XG4gICAgICAgICAgcGFyc2VkSWQuZW5kc1dpdGgoJy5zdmcnKVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoIWNvZGUuaW5jbHVkZXMoJzwhLS0nKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcyA9IG5ldyBNYWdpY1N0cmluZyhjb2RlKVxuICAgICAgcy5yZXBsYWNlKC88IS0tW1xcd1xcV1xcc10qPy0tPi9nLCAnJylcblxuICAgICAgaWYgKHMuaGFzQ2hhbmdlZCgpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29kZTogcy50b1N0cmluZygpLFxuICAgICAgICAgIG1hcDogc291cmNlbWFwICYmIChzLmdlbmVyYXRlTWFwKHsgc291cmNlOiBpZCwgaW5jbHVkZUNvbnRlbnQ6IHRydWUgfSkgYXMgYW55KSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gIH0gc2F0aXNmaWVzIFBsdWdpblxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VSxTQUFTLFNBQVMsZUFBZTtBQUMvVyxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxlQUFlO0FBQ3RCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sYUFBYTtBQUNwQixTQUFTLHVCQUF1QjtBQUNoQyxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGNBQWM7QUFDckIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sY0FBYztBQUNyQixPQUFPLGdCQUFnQjtBQUN2QixT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TyxzQkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixNQUFNLFFBQVEsSUFBSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLbEIsTUFBTTtBQUFBO0FBQUEsRUFFTixXQUFXO0FBQUE7QUFBQSxFQUVYLFVBQVU7QUFBQTtBQUFBLEVBRVYsUUFBUTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUEsRUFDUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9BLFFBQVE7QUFBQTtBQUFBLElBRU4scUNBQXFDO0FBQUEsRUFDdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUUEsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQTtBQUFBLEVB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
