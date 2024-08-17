// vite.config.ts
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/vite/dist/node/index.js";
import Vue from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/unplugin-vue-router/dist/vite.mjs";
import { VueRouterAutoImports } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/unplugin-vue-router/dist/index.mjs";
import Components from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/unplugin-auto-import/dist/vite.js";
import Unfonts from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/unplugin-fonts/dist/vite.mjs";
import { VitePluginRadar } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/vite-plugin-radar/dist/index.js";
import PurgeIcons from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import ImageMin from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/vite-plugin-imagemin/dist/index.mjs";
import VueI18nPlugin from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { VitePWA } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/vite-plugin-pwa/dist/index.js";
import purgecss from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/rollup-plugin-purgecss/lib/rollup-plugin-purgecss.js";
import UnheadVite from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/@unhead/addons/dist/vite.mjs";
import { unheadVueComposablesImports } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/@unhead/vue/dist/index.mjs";

// vite-plugin-vuero-doc/index.ts
import { join, basename } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/pathe/dist/index.mjs";
import { compileTemplate, parse } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js";

// vite-plugin-vuero-doc/markdown.ts
import yaml from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/js-yaml/dist/js-yaml.mjs";
import remarkShiki from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/@stefanprobst/remark-shiki/src/index.js";
import rehypeExternalLinks from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/rehype-external-links/index.js";
import rehypeRaw from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/rehype-raw/index.js";
import rehypeSlug from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/rehype-slug/index.js";
import rehypeAutolinkHeadings from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/rehype-autolink-headings/index.js";
import rehypeStringify from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/rehype-stringify/index.js";
import remarkParse from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/remark-parse/index.js";
import remarkGfm from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/remark-gfm/index.js";
import remarkRehype from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/remark-rehype/index.js";
import remarkFrontmatter from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/remark-frontmatter/index.js";
import { getHighlighter } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/shiki/dist/index.js";
import { unified } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/unified/index.js";
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
import { kebabCase } from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/scule/dist/index.mjs";
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
import MagicString from "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/node_modules/magic-string/dist/magic-string.es.mjs";
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
var __vite_injected_original_import_meta_url = "file:///home/dev/My%20Repose/vms.arez.io-web%20BackUp-SEE-SEr/vite.config.ts";
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
      include: resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "./src/locales/**"),
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
      imports: ["vue", "@vueuse/core", VueRouterAutoImports, unheadVueComposablesImports]
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
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "AREZ - Workforce Management Software",
        short_name: "Arez",
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
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, "");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4tdnVlcm8tZG9jL2luZGV4LnRzIiwgInZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9tYXJrZG93bi50cyIsICJ2aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzIiwgInZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGV2L015IFJlcG9zZS92bXMuYXJlei5pby13ZWIgQmFja1VwLVNFRS1TRXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2Rldi9NeSBSZXBvc2Uvdm1zLmFyZXouaW8td2ViIEJhY2tVcC1TRUUtU0VyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rldi9NeSUyMFJlcG9zZS92bXMuYXJlei5pby13ZWIlMjBCYWNrVXAtU0VFLVNFci92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZSdcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcidcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IFVuZm9udHMgZnJvbSAndW5wbHVnaW4tZm9udHMvdml0ZSdcbmltcG9ydCB7IFZpdGVQbHVnaW5SYWRhciB9IGZyb20gJ3ZpdGUtcGx1Z2luLXJhZGFyJ1xuaW1wb3J0IFB1cmdlSWNvbnMgZnJvbSAndml0ZS1wbHVnaW4tcHVyZ2UtaWNvbnMnXG5pbXBvcnQgSW1hZ2VNaW4gZnJvbSAndml0ZS1wbHVnaW4taW1hZ2VtaW4nXG5pbXBvcnQgVnVlSTE4blBsdWdpbiBmcm9tICdAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlJ1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcbmltcG9ydCBwdXJnZWNzcyBmcm9tICdyb2xsdXAtcGx1Z2luLXB1cmdlY3NzJ1xuaW1wb3J0IFVuaGVhZFZpdGUgZnJvbSAnQHVuaGVhZC9hZGRvbnMvdml0ZSdcbmltcG9ydCB7IHVuaGVhZFZ1ZUNvbXBvc2FibGVzSW1wb3J0cyB9IGZyb20gJ0B1bmhlYWQvdnVlJ1xuXG4vLyBsb2NhbCB2aXRlIHBsdWdpblxuaW1wb3J0IHsgVml0ZVBsdWdpblZ1ZXJvRG9jIH0gZnJvbSAnLi92aXRlLXBsdWdpbi12dWVyby1kb2MnXG5pbXBvcnQgeyBWaXRlUGx1Z2luUHVyZ2VDb21tZW50cyB9IGZyb20gJy4vdml0ZS1wbHVnaW4tcHVyZ2UtY29tbWVudHMnXG5cbi8vIG9wdGlvbnMgdmlhIGVudiB2YXJpYWJsZXNcbmNvbnN0IE1JTklGWV9JTUFHRVMgPSBwcm9jZXNzLmVudi5NSU5JRlkgPyBwcm9jZXNzLmVudi5NSU5JRlkgPT09ICd0cnVlJyA6IGZhbHNlXG5cbmNvbnN0IGlzUHJvZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBtYWluIGNvbmZpZ3VyYXRpb24gZmlsZSBmb3Igdml0ZWpzXG4gKlxuICogQHNlZSBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIC8vIFByb2plY3Qgcm9vdCBkaXJlY3RvcnkgKHdoZXJlIGluZGV4Lmh0bWwgaXMgbG9jYXRlZCkuXG4gIHJvb3Q6IHByb2Nlc3MuY3dkKCksXG4gIC8vIEJhc2UgcHVibGljIHBhdGggd2hlbiBzZXJ2ZWQgaW4gZGV2ZWxvcG1lbnQgb3IgcHJvZHVjdGlvbi5cbiAgLy8gWW91IGFsc28gbmVlZCB0byBhZGQgdGhpcyBiYXNlIGxpa2UgYGhpc3Rvcnk6IGNyZWF0ZVdlYkhpc3RvcnkoJ215LXN1YmRpcmVjdG9yeScpYFxuICAvLyBpbiAuL3NyYy9yb3V0ZXIudHNcbiAgLy8gYmFzZTogJy9teS1zdWJkaXJlY3RvcnkvJyxcbiAgYmFzZTogJy8nLFxuICAvLyBEaXJlY3RvcnkgdG8gc2VydmUgYXMgcGxhaW4gc3RhdGljIGFzc2V0cy5cbiAgcHVibGljRGlyOiAncHVibGljJyxcbiAgLy8gQWRqdXN0IGNvbnNvbGUgb3V0cHV0IHZlcmJvc2l0eS5cbiAgbG9nTGV2ZWw6ICdpbmZvJyxcbiAgLy8gZGV2ZWxvcG1lbnQgc2VydmVyIGNvbmZpZ3VyYXRpb25cbiAgc2VydmVyOiB7XG4gICAgLy8gVml0ZSA0IGRlZmF1bHRzIHRvIDUxNzMsIGJ1dCB5b3UgY2FuIG92ZXJyaWRlIGl0IHdpdGggdGhlIHBvcnQgb3B0aW9uLlxuICAgIHBvcnQ6IDMwMDAsXG4gIH0sXG4gIC8qKlxuICAgKiBEZWZpbmUgYWxsb3cgdG8gcmVwbGFjZSBzdHJpbmcgaW4gdGhlIGNvZGUgYXQgYnVpbGQgdGltZS5cbiAgICovXG4gIGRlZmluZToge1xuICAgIC8vIFZTQ09ERV9URVhUTUFURV9ERUJVRyBpcyB1c2VkIGluIHNoaWtpLCBidXQgaXQncyBub3QgZGVmaW5lZCBpbiB0aGUgYnJvd3NlclxuICAgICdwcm9jZXNzLmVudi5WU0NPREVfVEVYVE1BVEVfREVCVUcnOiAnZmFsc2UnLFxuICB9LFxuICAvKipcbiAgICogQnkgZGVmYXVsdCwgVml0ZSB3aWxsIGNyYXdsIHlvdXIgaW5kZXguaHRtbCB0byBkZXRlY3QgZGVwZW5kZW5jaWVzIHRoYXRcbiAgICogbmVlZCB0byBiZSBwcmUtYnVuZGxlZC4gSWYgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dCBpcyBzcGVjaWZpZWQsXG4gICAqIFZpdGUgd2lsbCBjcmF3bCB0aG9zZSBlbnRyeSBwb2ludHMgaW5zdGVhZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnLyNvcHRpbWl6ZWRlcHMtZW50cmllc1xuICAgKi9cbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgJ0Bja2VkaXRvci9ja2VkaXRvcjUtdnVlJyxcbiAgICAgICdAY2tlZGl0b3IvY2tlZGl0b3I1LWJ1aWxkLWNsYXNzaWMnLFxuICAgICAgJ0BpY29uaWZ5L2ljb25pZnknLFxuICAgICAgJ0BtYXBib3gvbWFwYm94LWdsLWdlb2NvZGVyL2Rpc3QvbWFwYm94LWdsLWdlb2NvZGVyLm1pbi5qcycsXG4gICAgICAnQHZlZS12YWxpZGF0ZS96b2QnLFxuICAgICAgJ0B2dWV1c2UvY29yZScsXG4gICAgICAnQHZ1ZWZvcm0vbXVsdGlzZWxlY3QnLFxuICAgICAgJ0B2dWVmb3JtL3NsaWRlcicsXG4gICAgICAnYmlsbGJvYXJkLmpzJyxcbiAgICAgICdkYXlqcycsXG4gICAgICAnZHJvcHpvbmUnLFxuICAgICAgJ2RyYWd1bGEnLFxuICAgICAgJ2RlZnUnLFxuICAgICAgJ2ZpbGVwb25kJyxcbiAgICAgICdmaWxlcG9uZC1wbHVnaW4tZmlsZS12YWxpZGF0ZS1zaXplJyxcbiAgICAgICdmaWxlcG9uZC1wbHVnaW4tZmlsZS12YWxpZGF0ZS10eXBlJyxcbiAgICAgICdmaWxlcG9uZC1wbHVnaW4taW1hZ2UtZXhpZi1vcmllbnRhdGlvbicsXG4gICAgICAnZmlsZXBvbmQtcGx1Z2luLWltYWdlLWNyb3AnLFxuICAgICAgJ2ZpbGVwb25kLXBsdWdpbi1pbWFnZS1lZGl0JyxcbiAgICAgICdmaWxlcG9uZC1wbHVnaW4taW1hZ2UtcHJldmlldycsXG4gICAgICAnZmlsZXBvbmQtcGx1Z2luLWltYWdlLXJlc2l6ZScsXG4gICAgICAnZmlsZXBvbmQtcGx1Z2luLWltYWdlLXRyYW5zZm9ybScsXG4gICAgICAnZm9jdXMtdHJhcC12dWUnLFxuICAgICAgJ2ltYXNrJyxcbiAgICAgICducHJvZ3Jlc3MnLFxuICAgICAgJ25vdHlmJyxcbiAgICAgICdtYXBib3gtZ2wnLFxuICAgICAgJ3Bob3Rvc3dpcGUvbGlnaHRib3gnLFxuICAgICAgJ3Bob3Rvc3dpcGUnLFxuICAgICAgJ3BseXInLFxuICAgICAgJ3YtY2FsZW5kYXInLFxuICAgICAgJ3ZlZS12YWxpZGF0ZScsXG4gICAgICAndnVlJyxcbiAgICAgICd2dWUtc2Nyb2xsdG8nLFxuICAgICAgJ3Z1ZTMtYXBleGNoYXJ0cycsXG4gICAgICAndnVlLXRpcHB5JyxcbiAgICAgICd2dWUtaTE4bicsXG4gICAgICAndnVlLXJvdXRlcicsXG4gICAgICAndW5wbHVnaW4tdnVlLXJvdXRlci9ydW50aW1lJyxcbiAgICAgICdzaW1wbGViYXInLFxuICAgICAgJ3Rpbnktc2xpZGVyL3NyYy90aW55LXNsaWRlcicsXG4gICAgICAndnVlLWFjY2Vzc2libGUtY29sb3ItcGlja2VyJyxcbiAgICAgICd6b2QnLFxuICAgICAgJ0BzdGVmYW5wcm9ic3QvcmVtYXJrLXNoaWtpJyxcbiAgICAgICdyZWh5cGUtZXh0ZXJuYWwtbGlua3MnLFxuICAgICAgJ3JlaHlwZS1yYXcnLFxuICAgICAgJ3JlaHlwZS1zYW5pdGl6ZScsXG4gICAgICAncmVoeXBlLXN0cmluZ2lmeScsXG4gICAgICAncmVoeXBlLXNsdWcnLFxuICAgICAgJ3JlaHlwZS1hdXRvbGluay1oZWFkaW5ncycsXG4gICAgICAncmVtYXJrLWdmbScsXG4gICAgICAncmVtYXJrLXBhcnNlJyxcbiAgICAgICdyZW1hcmstcmVoeXBlJyxcbiAgICAgICdzaGlraScsXG4gICAgICAndW5pZmllZCcsXG4gICAgICAnd29ya2JveC13aW5kb3cnLFxuICAgICAgJ3RleHRhcmVhLW1hcmtkb3duLWVkaXRvci9kaXN0L2VzbS9ib290c3RyYXAnLFxuICAgIF0sXG4gICAgLy8gZGlzYWJsZWQ6IGZhbHNlLFxuICB9LFxuICAvLyBXaWxsIGJlIHBhc3NlZCB0byBAcm9sbHVwL3BsdWdpbi1hbGlhcyBhcyBpdHMgZW50cmllcyBvcHRpb24uXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiAnL0BzcmMvJyxcbiAgICAgICAgcmVwbGFjZW1lbnQ6IGAvc3JjL2AsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIC8vIERvIG5vdCB3YXJuIGFib3V0IGxhcmdlIGNodW5rc1xuICAgIC8vIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogSW5maW5pdHksXG4gICAgLy8gRG91YmxlIHRoZSBkZWZhdWx0IHNpemUgdGhyZXNob2xkIGZvciBpbmxpbmVkIGFzc2V0c1xuICAgIC8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvYnVpbGQtb3B0aW9ucy5odG1sI2J1aWxkLWFzc2V0c2lubGluZWxpbWl0XG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYgKiAyLFxuICAgIC8vIGNvbW1vbmpzT3B0aW9uczogeyBpbmNsdWRlOiBbXSB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgLyoqXG4gICAgICogcGx1Z2luLXZ1ZSBwbHVnaW4gaW5qZWN0IHZ1ZSBsaWJyYXJ5IGFuZCBhbGxvdyBzZmMgZmlsZXMgdG8gd29yayAoKi52dWUpXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlanMvdml0ZS90cmVlL21haW4vcGFja2FnZXMvcGx1Z2luLXZ1ZVxuICAgICAqL1xuICAgIFZ1ZSh7XG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvXSxcbiAgICAgIHNjcmlwdDoge1xuICAgICAgICBkZWZpbmVNb2RlbDogdHJ1ZSxcbiAgICAgICAgcHJvcHNEZXN0cnVjdHVyZTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB1bnBsdWdpbi12dWUtaTE4biBwbHVnaW4gZG9lcyBpMThuIHJlc291cmNlcyBwcmUtY29tcGlsYXRpb24gLyBvcHRpbWl6YXRpb25zXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9pbnRsaWZ5L2J1bmRsZS10b29scy9ibG9iL21haW4vcGFja2FnZXMvdW5wbHVnaW4tdnVlLWkxOG4vUkVBRE1FLm1kXG4gICAgICovXG4gICAgVnVlSTE4blBsdWdpbih7XG4gICAgICBpbmNsdWRlOiByZXNvbHZlKGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSwgJy4vc3JjL2xvY2FsZXMvKionKSxcbiAgICAgIGZ1bGxJbnN0YWxsOiBmYWxzZSxcbiAgICAgIGNvbXBvc2l0aW9uT25seTogdHJ1ZSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHVucGx1Z2luLXZ1ZS1yb3V0ZXIgcGx1Z2luIGdlbmVyYXRlIHJvdXRlcyBiYXNlZCBvbiBmaWxlIHN5c3RlbVxuICAgICAqIGFsbG93IHRvIHVzZSB0eXBlZCByb3V0ZXMgYW5kIHVzYWdlIG9mIGRlZmluZUxvYWRlclxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcG9zdmEvdW5wbHVnaW4tdnVlLXJvdXRlclxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3JmY3MvYmxvYi9hZDY5ZGEyYWVlOTI0MmVmODhmMDM2NzEzZGI2OGYzZWYyNzRiYjFiL2FjdGl2ZS1yZmNzLzAwMDAtcm91dGVyLXVzZS1sb2FkZXIubWRcbiAgICAgKi9cbiAgICBWdWVSb3V0ZXIoe1xuICAgICAgcm91dGVzRm9sZGVyOiAnc3JjL3BhZ2VzJyxcbiAgICAgIGR0czogJy4vdHlwZXMvcm91dGVyLmQudHMnLFxuXG4gICAgICAvKipcbiAgICAgICAqIERhdGEgRmV0Y2hpbmcgaXMgYW4gZXhwZXJpbWVudGFsIGZlYXR1cmUgZnJvbSB2dWUgJiB2dWUtcm91dGVyXG4gICAgICAgKlxuICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvcmZjcy9kaXNjdXNzaW9ucy80NjBcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bvc3ZhL3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdHJlZS9tYWluL3NyYy9kYXRhLWZldGNoaW5nXG4gICAgICAgKi9cbiAgICAgIGRhdGFGZXRjaGluZzogdHJ1ZSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIFVuaGVhZCBwcm92aWRlcyBhIFZpdGUgcGx1Z2luIHRvIG9wdGltaXNlIHlvdXIgYnVpbGRzLCBieSByZW1vdmluZyBjb21wb3NhYmxlcyB0aGF0IGFyZW4ndCBuZWVkZWQgYW5kIHNpbXBsaWZ5aW5nIHlvdXIgY29kZS5cbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly91bmhlYWQuaGFybGFuencuY29tL2d1aWRlL2dldHRpbmctc3RhcnRlZC92aXRlLXBsdWdpblxuICAgICAqL1xuICAgIFVuaGVhZFZpdGUoKSxcblxuICAgIC8qKlxuICAgICAqIHVucGx1Z2luLWF1dG8taW1wb3J0IGFsbG93IHRvIGF1dG9tYXRpY2FseSBpbXBvcnQgbW9kdWxlcy9jb21wb25lbnRzXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydFxuICAgICAqL1xuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgZHRzOiAnLi90eXBlcy9pbXBvcnRzLmQudHMnLFxuICAgICAgaW1wb3J0czogWyd2dWUnLCAnQHZ1ZXVzZS9jb3JlJywgVnVlUm91dGVyQXV0b0ltcG9ydHMsIHVuaGVhZFZ1ZUNvbXBvc2FibGVzSW1wb3J0c10sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGFuIGludGVybmFsIHZpdGUgcGx1Z2luIHRoYXQgbG9hZCBtYXJrZG93biBmaWxlcyBhcyB2dWUgY29tcG9uZW50cy5cbiAgICAgKlxuICAgICAqIEBzZWUgL2RvY3VtZW50YXRpb25cbiAgICAgKiBAc2VlIC92aXRlLXBsdWdpbi12dWVyby1kb2NcbiAgICAgKiBAc2VlIC9zcmMvY29tcG9uZW50cy9wYXJ0aWFscy9kb2N1bWVudGF0aW9uL0RvY3VtZW50YXRpb25JdGVtLnZ1ZVxuICAgICAqIEBzZWUgL3NyYy9jb21wb3NhYmxlL3VzZU1hcmtkb3duVG9jLnRzXG4gICAgICovXG4gICAgVml0ZVBsdWdpblZ1ZXJvRG9jKHtcbiAgICAgIHBhdGhQcmVmaXg6ICdkb2N1bWVudGF0aW9uJyxcbiAgICAgIHdyYXBwZXJDb21wb25lbnQ6ICdEb2N1bWVudGF0aW9uSXRlbScsXG4gICAgICBzaGlraToge1xuICAgICAgICB0aGVtZToge1xuICAgICAgICAgIGxpZ2h0OiAnbWluLWxpZ2h0JyxcbiAgICAgICAgICBkYXJrOiAnZ2l0aHViLWRhcmsnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNvdXJjZU1ldGE6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZWRpdFByb3RvY29sOiAndnNjb2RlOi8vdnNjb2RlLXJlbW90ZS93c2wrVWJ1bnR1JywgLy8gb3IgJ3ZzY29kZTovL2ZpbGUnXG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBhbiBpbnRlcm5hbCB2aXRlIHBsdWdpbiB0aGF0IHJlbW92ZSBodG1sIGNvbW1lbnRzIGZyb20gY29kZS5cbiAgICAgKlxuICAgICAqIEBzZWUgL3ZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzXG4gICAgICovXG4gICAgVml0ZVBsdWdpblB1cmdlQ29tbWVudHMoKSxcblxuICAgIC8qKlxuICAgICAqIHVucGx1Z2luLXZ1ZS1jb21wb25lbnRzIHBsdWdpbiBpcyByZXNwb25zaWJsZSBvZiBhdXRvbG9hZGluZyBjb21wb25lbnRzXG4gICAgICogZG9jdW1lbnRhdGlvbiBhbmQgbWQgZmlsZSBhcmUgbG9hZGVkIGZvciBlbGVtZW50cyBhbmQgY29tcG9uZW50cyBzZWN0aW9uc1xuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICAgKi9cbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGRpcnM6IFsnZG9jdW1lbnRhdGlvbicsICdzcmMvY29tcG9uZW50cycsICdzcmMvbGF5b3V0cyddLFxuICAgICAgZXh0ZW5zaW9uczogWyd2dWUnLCAnbWQnXSxcbiAgICAgIGR0czogJy4vdHlwZXMvY29tcG9uZW50cy5kLnRzJyxcbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB2aXRlLXBsdWdpbi1wdXJnZS1pY29ucyBwbHVnaW4gaXMgcmVzcG9uc2libGUgb2YgYXV0b2xvYWRpbmcgaWNvbmVzIGZyb20gbXVsdGlwbGVzIHByb3ZpZGVyc1xuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2ljb25lcy5uZXRsaWZ5LmFwcC9cbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS9wdXJnZS1pY29ucy90cmVlL21haW4vcGFja2FnZXMvdml0ZS1wbHVnaW4tcHVyZ2UtaWNvbnNcbiAgICAgKi9cbiAgICBQdXJnZUljb25zKCksXG5cbiAgICAvKipcbiAgICAgKiB2aXRlLXBsdWdpbi1mb250cyBwbHVnaW4gaW5qZWN0IHdlYmZvbnRzIGZyb20gZGlmZmVyZW50cyBwcm92aWRlcnNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3N0YWZ5bmlha3NhY2hhL3ZpdGUtcGx1Z2luLWZvbnRzXG4gICAgICovXG4gICAgVW5mb250cyh7XG4gICAgICBnb29nbGU6IHtcbiAgICAgICAgZmFtaWxpZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnRmlyYSBDb2RlJyxcbiAgICAgICAgICAgIHN0eWxlczogJ3dnaHRANDAwOzYwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnTW9udHNlcnJhdCcsXG4gICAgICAgICAgICBzdHlsZXM6ICd3Z2h0QDUwMDs2MDA7NzAwOzgwMDs5MDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1JvYm90bycsXG4gICAgICAgICAgICBzdHlsZXM6ICd3Z2h0QDMwMDs0MDA7NTAwOzYwMDs3MDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdml0ZS1wbHVnaW4tcmFkYXIgcGx1Z2luIGluamVjdCBzbmlwcGV0cyBmcm9tIGFuYWx5dGljcyBwcm92aWRlcnNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3N0YWZ5bmlha3NhY2hhL3ZpdGUtcGx1Z2luLXJhZGFyXG4gICAgICovXG4gICAgIXByb2Nlc3MuZW52LkdUTV9JRFxuICAgICAgPyB1bmRlZmluZWRcbiAgICAgIDogVml0ZVBsdWdpblJhZGFyKHtcbiAgICAgICAgICBndG06IHtcbiAgICAgICAgICAgIGlkOiBwcm9jZXNzLmVudi5HVE1fSUQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB2aXRlLXBsdWdpbi1wd2EgZ2VuZXJhdGUgbWFuaWZlc3QuanNvbiBhbmQgcmVnaXN0ZXIgc2VydmljZXMgd29ya2VyIHRvIGVuYWJsZSBQV0FcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtcGx1Z2luLXB3YVxuICAgICAqL1xuICAgIFZpdGVQV0Eoe1xuICAgICAgYmFzZTogJy8nLFxuICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLnN2ZycsICdmYXZpY29uLmljbycsICdyb2JvdHMudHh0JywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJ10sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiAnQVJFWiAtIFdvcmtmb3JjZSBNYW5hZ2VtZW50IFNvZnR3YXJlJyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ0FyZXonLFxuICAgICAgICBzdGFydF91cmw6ICcvP3V0bV9zb3VyY2U9cHdhJyxcbiAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxuICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAncHdhLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ3B3YS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSBtYXNrYWJsZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBtb2RlOiBpc1Byb2QgPyAncHJvZHVjdGlvbicgOiAnZGV2ZWxvcG1lbnQnLFxuICAgICAgLy8gcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBwcmVjYWNoZSBmaWxlcyB0aGF0IG1hdGNoIHRoZSBnbG9iIHBhdHRlcm5cbiAgICAgICAgICpcbiAgICAgICAgICogQHNlZSBodHRwczovL3ZpdGUtcHdhLW9yZy5uZXRsaWZ5LmFwcC9ndWlkZS9zZXJ2aWNlLXdvcmtlci1wcmVjYWNoZS5odG1sXG4gICAgICAgICAqL1xuICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57anMsY3NzLGljbyxwbmcsc3ZnLHdlYnAsanBnLGpwZWd9J10sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFkZCBleHRlcm5hbCBjYWNoZSBvZiBnb29nbGUgZm9udHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHNlZSBodHRwczovL3ZpdGUtcHdhLW9yZy5uZXRsaWZ5LmFwcC93b3JrYm94L2dlbmVyYXRlLXN3Lmh0bWxcbiAgICAgICAgICovXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdvb2dsZWFwaXNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdnb29nbGUtZm9udHMtY2FjaGUnLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAsXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1LCAvLyA8PT0gMzY1IGRheXNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdzdGF0aWNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdnc3RhdGljLWZvbnRzLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSwgLy8gPD09IDM2NSBkYXlzXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHJvbGx1cC1wbHVnaW4tcHVyZ2Vjc3MgcGx1Z2luIGlzIHJlc3BvbnNpYmxlIG9mIHB1cmdpbmcgY3NzIHJ1bGVzXG4gICAgICogdGhhdCBhcmUgbm90IHVzZWQgaW4gdGhlIGJ1bmRsZVxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vRnVsbEh1bWFuL3B1cmdlY3NzL3RyZWUvbWFpbi9wYWNrYWdlcy9yb2xsdXAtcGx1Z2luLXB1cmdlY3NzXG4gICAgICovXG4gICAgcHVyZ2Vjc3Moe1xuICAgICAgb3V0cHV0OiBmYWxzZSxcbiAgICAgIGNvbnRlbnQ6IFtgLi9zcmMvKiovKi52dWVgXSxcbiAgICAgIHZhcmlhYmxlczogZmFsc2UsXG4gICAgICBzYWZlbGlzdDoge1xuICAgICAgICBzdGFuZGFyZDogW1xuICAgICAgICAgIC8oYXV0dnxsbmlsfGxuaXJ8ZmFzPykvLFxuICAgICAgICAgIC8tKGxlYXZlfGVudGVyfGFwcGVhcikofC0odG98ZnJvbXxhY3RpdmUpKSQvLFxuICAgICAgICAgIC9eKD8hKHwuKj86KWN1cnNvci1tb3ZlKS4rLW1vdmUkLyxcbiAgICAgICAgICAvXnJvdXRlci1saW5rKHwtZXhhY3QpLWFjdGl2ZSQvLFxuICAgICAgICAgIC9kYXRhLXYtLiovLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRFeHRyYWN0b3IoY29udGVudCkge1xuICAgICAgICBjb25zdCBjb250ZW50V2l0aG91dFN0eWxlQmxvY2tzID0gY29udGVudC5yZXBsYWNlKC88c3R5bGVbXl0rPzxcXC9zdHlsZT4vZ2ksICcnKVxuICAgICAgICByZXR1cm4gY29udGVudFdpdGhvdXRTdHlsZUJsb2Nrcy5tYXRjaCgvW0EtWmEtejAtOS1fLzpdKltBLVphLXowLTktXy9dKy9nKSB8fCBbXVxuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHZpdGUtcGx1Z2luLWltYWdlbWluIG9wdGltaXplIGFsbCBpbWFnZXMgc2l6ZXMgZnJvbSBwdWJsaWMgb3IgYXNzZXQgZm9sZGVyXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbm5jd2Ivdml0ZS1wbHVnaW4taW1hZ2VtaW5cbiAgICAgKi9cbiAgICAhTUlOSUZZX0lNQUdFU1xuICAgICAgPyB1bmRlZmluZWRcbiAgICAgIDogSW1hZ2VNaW4oe1xuICAgICAgICAgIGdpZnNpY2xlOiB7XG4gICAgICAgICAgICBvcHRpbWl6YXRpb25MZXZlbDogNyxcbiAgICAgICAgICAgIGludGVybGFjZWQ6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3B0aXBuZzoge1xuICAgICAgICAgICAgb3B0aW1pemF0aW9uTGV2ZWw6IDcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtb3pqcGVnOiB7XG4gICAgICAgICAgICBxdWFsaXR5OiA2MCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBuZ3F1YW50OiB7XG4gICAgICAgICAgICBxdWFsaXR5OiBbMC44LCAwLjldLFxuICAgICAgICAgICAgc3BlZWQ6IDQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdmdvOiB7XG4gICAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVtb3ZlVmlld0JveCcsXG4gICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdyZW1vdmVFbXB0eUF0dHJzJyxcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgXSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2Rldi9NeSBSZXBvc2Uvdm1zLmFyZXouaW8td2ViIEJhY2tVcC1TRUUtU0VyL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV2L015IFJlcG9zZS92bXMuYXJlei5pby13ZWIgQmFja1VwLVNFRS1TRXIvdml0ZS1wbHVnaW4tdnVlcm8tZG9jL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rldi9NeSUyMFJlcG9zZS92bXMuYXJlei5pby13ZWIlMjBCYWNrVXAtU0VFLVNFci92aXRlLXBsdWdpbi12dWVyby1kb2MvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiwgUmVzb2x2ZWRDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHR5cGUgeyBQcm9jZXNzb3IgfSBmcm9tICd1bmlmaWVkJ1xuaW1wb3J0IHR5cGUgeyBUaGVtZSB9IGZyb20gJ3NoaWtpJ1xuXG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gJ3BhdGhlJ1xuaW1wb3J0IHsgY29tcGlsZVRlbXBsYXRlLCBwYXJzZSB9IGZyb20gJ0B2dWUvY29tcGlsZXItc2ZjJ1xuXG5pbXBvcnQgeyBjcmVhdGVQcm9jZXNzb3JzIH0gZnJvbSAnLi9tYXJrZG93bidcbmltcG9ydCB7IHRyYW5zZm9ybUV4YW1wbGVNYXJrdXAsIHRyYW5zZm9ybVNsb3RzIH0gZnJvbSAnLi90cmFuc2Zvcm0nXG5cbmZ1bmN0aW9uIHBhcnNlSWQoaWQ6IHN0cmluZykge1xuICBjb25zdCBpbmRleCA9IGlkLmluZGV4T2YoJz8nKVxuICBpZiAoaW5kZXggPCAwKSByZXR1cm4gaWRcbiAgZWxzZSByZXR1cm4gaWQuc2xpY2UoMCwgaW5kZXgpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGx1Z2luT3B0aW9ucyB7XG4gIHBhdGhQcmVmaXg/OiBzdHJpbmdcbiAgd3JhcHBlckNvbXBvbmVudDogc3RyaW5nXG4gIHNoaWtpOiB7XG4gICAgdGhlbWU6XG4gICAgICB8IFRoZW1lXG4gICAgICB8IHtcbiAgICAgICAgICBsaWdodDogVGhlbWVcbiAgICAgICAgICBkYXJrOiBUaGVtZVxuICAgICAgICB9XG4gIH1cbiAgc291cmNlTWV0YT86IHtcbiAgICBlbmFibGVkPzogYm9vbGVhblxuICAgIGVkaXRQcm90b2NvbD86IHN0cmluZ1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWaXRlUGx1Z2luVnVlcm9Eb2Mob3B0aW9uczogUGx1Z2luT3B0aW9ucykge1xuICBsZXQgY29uZmlnOiBSZXNvbHZlZENvbmZpZyB8IHVuZGVmaW5lZFxuICBsZXQgcHJvY2Vzc29yczogeyBsaWdodDogUHJvY2Vzc29yOyBkYXJrOiBQcm9jZXNzb3IgfSB8IHVuZGVmaW5lZFxuXG4gIGNvbnN0IGN3ZCA9IHByb2Nlc3MuY3dkKClcbiAgY29uc3QgcGF0aFByZWZpeCA9IG9wdGlvbnMucGF0aFByZWZpeCA/IGpvaW4oY3dkLCBvcHRpb25zLnBhdGhQcmVmaXgpIDogY3dkXG5cbiAgYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25Ub1Z1ZShpZDogc3RyaW5nLCByYXc6IHN0cmluZykge1xuICAgIGNvbnN0IHBhdGggPSBwYXJzZUlkKGlkKVxuXG4gICAgLy8gdHJhbnNmb3JtIGV4YW1wbGUgbWFya3VwIHRvIHVzZSBrZWJhYi1jYXNlIHdpdGhvdXQgc2VsZi1jbG9zaW5nIGVsZW1lbnRzLlxuICAgIC8vIHRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgcmVoeXBlLXJhdyByZXF1aXJlcyB2YWxpZCBodG1sIChvbmx5IHNvbWUgdGFncyBhcmUgc2VsZi1jbG9zYWJsZSlcbiAgICBjb25zdCBpbnB1dCA9IHRyYW5zZm9ybUV4YW1wbGVNYXJrdXAocmF3KVxuXG4gICAgLy8gcHJvY2VzcyBtYXJrZG93biB3aXRoIHJlbWFya1xuICAgIGlmICghcHJvY2Vzc29ycykgcHJvY2Vzc29ycyA9IGF3YWl0IGNyZWF0ZVByb2Nlc3NvcnMob3B0aW9ucy5zaGlraS50aGVtZSlcblxuICAgIGNvbnN0IFt2RmlsZUxpZ2h0LCB2RmlsZURhcmtdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgcHJvY2Vzc29ycy5saWdodC5wcm9jZXNzKGlucHV0KSxcbiAgICAgIHByb2Nlc3NvcnMuZGFyay5wcm9jZXNzKGlucHV0KSxcbiAgICBdKVxuXG4gICAgY29uc3QgY29udGVudExpZ2h0ID0gdkZpbGVMaWdodC50b1N0cmluZygpXG4gICAgY29uc3QgY29udGVudERhcmsgPSB2RmlsZURhcmsudG9TdHJpbmcoKVxuICAgIGNvbnN0IGZyb250bWF0dGVyID0gdkZpbGVMaWdodC5kYXRhPy5mcm9udG1hdHRlciA/PyB7fVxuXG4gICAgLy8gcmVwbGFjZSBjb2RlL2V4YW1wbGUgc2xvdHMgcGxhY2Vob2xkZXJzXG4gICAgY29uc3Qgc2xvdExpZ2h0ID0gdHJhbnNmb3JtU2xvdHMoY29udGVudExpZ2h0LCAndi1pZj1cIiFkYXJrbW9kZS5pc0RhcmtcIicpXG4gICAgY29uc3Qgc2xvdERhcmsgPSB0cmFuc2Zvcm1TbG90cyhjb250ZW50RGFyaywgJ3YtaWY9XCJkYXJrbW9kZS5pc0RhcmtcIicpXG5cbiAgICAvLyB3cmFwIGNvbnRlbnQgaW4gd3JhcHBlciBjb21wb25lbnQgZGVmYXVsdCBzbG90XG4gICAgY29uc3Qgc2ZjID0gW1xuICAgICAgYDx0ZW1wbGF0ZT5gLFxuICAgICAgYCAgPCR7b3B0aW9ucy53cmFwcGVyQ29tcG9uZW50fSA6ZnJvbnRtYXR0ZXI9XCJmcm9udG1hdHRlclwiIDpzb3VyY2UtbWV0YT1cInNvdXJjZU1ldGFcIj5gLFxuICAgICAgYCAgICAke3Nsb3RMaWdodH1gLFxuICAgICAgYCAgICAke3Nsb3REYXJrfWAsXG4gICAgICBgICA8LyR7b3B0aW9ucy53cmFwcGVyQ29tcG9uZW50fT5gLFxuICAgICAgYDwvdGVtcGxhdGU+YCxcbiAgICBdLmpvaW4oJ1xcbicpXG5cbiAgICAvLyBwYXJzZSB0ZW1wbGF0ZSB3aXRoIHZ1ZSBzZmMgY29tcGlsZXJcbiAgICBjb25zdCByZXN1bHQgPSBwYXJzZShzZmMsIHtcbiAgICAgIGZpbGVuYW1lOiBwYXRoLFxuICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgIH0pXG5cbiAgICBpZiAocmVzdWx0LmVycm9ycy5sZW5ndGggfHwgcmVzdWx0LmRlc2NyaXB0b3IudGVtcGxhdGUgPT09IG51bGwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9ycylcblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXJrZG93bjogdW5hYmxlIHRvIHBhcnNlIHZpcnR1YWwgZmlsZSBnZW5lcmF0ZWQgZm9yIFwiJHtpZH1cImApXG4gICAgfVxuXG4gICAgLy8gY29tcGlsZSB0ZW1wbGF0ZSB3aXRoIHZ1ZSBzZmMgY29tcGlsZXJcbiAgICBjb25zdCB7IGNvZGUsIGVycm9ycyB9ID0gY29tcGlsZVRlbXBsYXRlKHtcbiAgICAgIGZpbGVuYW1lOiBwYXRoLFxuICAgICAgaWQ6IHBhdGgsXG4gICAgICBzb3VyY2U6IHJlc3VsdC5kZXNjcmlwdG9yLnRlbXBsYXRlLmNvbnRlbnQsXG4gICAgICBwcmVwcm9jZXNzTGFuZzogcmVzdWx0LmRlc2NyaXB0b3IudGVtcGxhdGUubGFuZyxcbiAgICAgIHRyYW5zZm9ybUFzc2V0VXJsczogZmFsc2UsXG4gICAgfSlcblxuICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9ycylcblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXJrZG93bjogdW5hYmxlIHRvIGNvbXBpbGUgdmlydHVhbCBmaWxlIFwiJHtpZH1cImApXG4gICAgfVxuXG4gICAgLy8gc291cmNlIGlzIHVzZWQgdG8gZGlzcGxheSBlZGl0IHNvdXJjZSBsaW5rIGluIHRoZSBkb2NzXG4gICAgbGV0IHNvdXJjZU1ldGEgPSAndW5kZWZpbmVkJ1xuICAgIGlmIChvcHRpb25zLnNvdXJjZU1ldGE/LmVuYWJsZWQpIHtcbiAgICAgIHNvdXJjZU1ldGEgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHJlbGF0aXZlUGF0aDogcGF0aC5zdWJzdHJpbmcoY3dkLmxlbmd0aCksXG4gICAgICAgIGJhc2VuYW1lOiBiYXNlbmFtZShwYXRoKSxcbiAgICAgICAgcGF0aDogY29uZmlnPy5pc1Byb2R1Y3Rpb24gPyAnJyA6IHBhdGgsXG4gICAgICAgIGVkaXRQcm90b2NvbDogY29uZmlnPy5pc1Byb2R1Y3Rpb24gPyAnJyA6IG9wdGlvbnMuc291cmNlTWV0YS5lZGl0UHJvdG9jb2wsXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIGluamVjdCBmcm9udG1hdHRlci9kYXJrbW9kZSBhbmQgaG1ySWQgaW50byB0aGUgY29tcGlsZWQgcmVuZGVyIGZ1bmN0aW9uXG4gICAgY29uc3Qgb3V0cHV0ID0gW1xuICAgICAgYGltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ2AsXG4gICAgICBgaW1wb3J0IHsgdXNlRGFya21vZGUgfSBmcm9tICcvQHNyYy9zdG9yZXMvZGFya21vZGUnYCxcblxuICAgICAgY29kZS5yZXBsYWNlKCdleHBvcnQgZnVuY3Rpb24gcmVuZGVyJywgJ2Z1bmN0aW9uIHJlbmRlcicpLFxuXG4gICAgICBgY29uc3QgX19mcm9udG1hdHRlciA9ICR7SlNPTi5zdHJpbmdpZnkoZnJvbnRtYXR0ZXIpfTtgLFxuICAgICAgYGNvbnN0IHNldHVwID0gKCkgPT4gKHtgLFxuICAgICAgYCAgZnJvbnRtYXR0ZXI6IHJlYWN0aXZlKF9fZnJvbnRtYXR0ZXIpLGAsXG4gICAgICBgICBkYXJrbW9kZTogdXNlRGFya21vZGUoKSxgLFxuICAgICAgYCAgc291cmNlTWV0YTogJHtzb3VyY2VNZXRhfSxgLFxuICAgICAgYH0pO2AsXG4gICAgICBgY29uc3QgX19zY3JpcHQgPSB7IHJlbmRlciwgc2V0dXAgfTtgLFxuXG4gICAgICBjb25maWc/LmlzUHJvZHVjdGlvbiA/ICcnIDogYF9fc2NyaXB0Ll9faG1ySWQgPSAke0pTT04uc3RyaW5naWZ5KHBhdGgpfTtgLFxuICAgICAgYGV4cG9ydCBkZWZhdWx0IF9fc2NyaXB0O2AsXG4gICAgXS5qb2luKCdcXG4nKVxuXG4gICAgcmV0dXJuIG91dHB1dFxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZS1wbHVnaW4tdnVlcm8tZG9jJyxcbiAgICBlbmZvcmNlOiAncHJlJyxcbiAgICBjb25maWdSZXNvbHZlZChfY29uZmlnKSB7XG4gICAgICBjb25maWcgPSBfY29uZmlnXG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2Zvcm0ocmF3LCBpZCkge1xuICAgICAgaWYgKGlkLmVuZHNXaXRoKCcubWQnKSAmJiBpZC5zdGFydHNXaXRoKHBhdGhQcmVmaXgpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBtYXJrZG93blRvVnVlKGlkLCByYXcpXG4gICAgICB9XG4gICAgfSxcbiAgfSBzYXRpc2ZpZXMgUGx1Z2luXG59XG5cbmV4cG9ydCBkZWZhdWx0IFZpdGVQbHVnaW5WdWVyb0RvY1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXYvTXkgUmVwb3NlL3Ztcy5hcmV6LmlvLXdlYiBCYWNrVXAtU0VFLVNFci92aXRlLXBsdWdpbi12dWVyby1kb2NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2Rldi9NeSBSZXBvc2Uvdm1zLmFyZXouaW8td2ViIEJhY2tVcC1TRUUtU0VyL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9tYXJrZG93bi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kZXYvTXklMjBSZXBvc2Uvdm1zLmFyZXouaW8td2ViJTIwQmFja1VwLVNFRS1TRXIvdml0ZS1wbHVnaW4tdnVlcm8tZG9jL21hcmtkb3duLnRzXCI7aW1wb3J0IHlhbWwgZnJvbSAnanMteWFtbCdcbmltcG9ydCByZW1hcmtTaGlraSBmcm9tICdAc3RlZmFucHJvYnN0L3JlbWFyay1zaGlraSdcbmltcG9ydCByZWh5cGVFeHRlcm5hbExpbmtzIGZyb20gJ3JlaHlwZS1leHRlcm5hbC1saW5rcydcbmltcG9ydCByZWh5cGVSYXcgZnJvbSAncmVoeXBlLXJhdydcbmltcG9ydCByZWh5cGVTbHVnIGZyb20gJ3JlaHlwZS1zbHVnJ1xuaW1wb3J0IHJlaHlwZUF1dG9saW5rSGVhZGluZ3MgZnJvbSAncmVoeXBlLWF1dG9saW5rLWhlYWRpbmdzJ1xuaW1wb3J0IHJlaHlwZVN0cmluZ2lmeSBmcm9tICdyZWh5cGUtc3RyaW5naWZ5J1xuaW1wb3J0IHJlbWFya1BhcnNlIGZyb20gJ3JlbWFyay1wYXJzZSdcbmltcG9ydCByZW1hcmtHZm0gZnJvbSAncmVtYXJrLWdmbSdcbmltcG9ydCByZW1hcmtSZWh5cGUgZnJvbSAncmVtYXJrLXJlaHlwZSdcbmltcG9ydCByZW1hcmtGcm9udG1hdHRlciBmcm9tICdyZW1hcmstZnJvbnRtYXR0ZXInXG5pbXBvcnQgeyBnZXRIaWdobGlnaHRlciwgdHlwZSBJVGhlbWVSZWdpc3RyYXRpb24sIHR5cGUgTGFuZywgdHlwZSBUaGVtZSB9IGZyb20gJ3NoaWtpJ1xuaW1wb3J0IHsgdW5pZmllZCwgdHlwZSBQcm9jZXNzb3IgfSBmcm9tICd1bmlmaWVkJ1xuXG5jb25zdCBsYW5ncyA9IFsndnVlJywgJ3Z1ZS1odG1sJywgJ3R5cGVzY3JpcHQnLCAnYmFzaCcsICdzY3NzJ10gc2F0aXNmaWVzIExhbmdbXVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHJvY2Vzc29yKHRoZW1lOiBJVGhlbWVSZWdpc3RyYXRpb24pOiBQcm9taXNlPFByb2Nlc3Nvcj4ge1xuICBjb25zdCBoaWdobGlnaHRlciA9IGF3YWl0IGdldEhpZ2hsaWdodGVyKHtcbiAgICB0aGVtZSxcbiAgICBsYW5ncyxcbiAgfSlcblxuICByZXR1cm4gdW5pZmllZCgpXG4gICAgLnVzZShyZW1hcmtQYXJzZSlcbiAgICAudXNlKHJlbWFya0Zyb250bWF0dGVyKVxuICAgIC51c2UoKCkgPT4gKHRyZWUsIGZpbGUpID0+IHtcbiAgICAgIGlmICh0cmVlLmNoaWxkcmVuWzBdLnR5cGUgPT09ICd5YW1sJykge1xuICAgICAgICAvLyBzdG9yZSBmcm9udG1hdHRlciBpbiB2ZmlsZVxuICAgICAgICBmaWxlLmRhdGEuZnJvbnRtYXR0ZXIgPSB5YW1sLmxvYWQodHJlZS5jaGlsZHJlblswXS52YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIC51c2UocmVtYXJrR2ZtKVxuICAgIC51c2UocmVtYXJrU2hpa2ksIHsgaGlnaGxpZ2h0ZXIgfSlcbiAgICAudXNlKHJlbWFya1JlaHlwZSwgeyBhbGxvd0Rhbmdlcm91c0h0bWw6IHRydWUgfSlcbiAgICAudXNlKHJlaHlwZVJhdylcbiAgICAudXNlKHJlaHlwZUV4dGVybmFsTGlua3MsIHsgcmVsOiBbJ25vZm9sbG93J10sIHRhcmdldDogJ19ibGFuaycgfSlcbiAgICAudXNlKHJlaHlwZVNsdWcpXG4gICAgLnVzZShyZWh5cGVBdXRvbGlua0hlYWRpbmdzLCB7XG4gICAgICBiZWhhdmlvcjogJ2FwcGVuZCcsXG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIHR5cGU6ICdlbGVtZW50JyxcbiAgICAgICAgdGFnTmFtZTogJ2knLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgY2xhc3NOYW1lOiBbJ2ljb25pZnkgdG9jLWxpbmstYW5jaG9yJ10sXG4gICAgICAgICAgZGF0YUljb246ICdmZWF0aGVyOmxpbmsnLFxuICAgICAgICB9LFxuICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICB9LFxuICAgICAgdGVzdDogKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIEFycmF5LmlzQXJyYXkobm9kZS5wcm9wZXJ0aWVzPy5jbGFzc05hbWUpICYmXG4gICAgICAgICAgbm9kZS5wcm9wZXJ0aWVzPy5jbGFzc05hbWU/LmluY2x1ZGVzKCd0b2MtaWdub3JlJylcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJvb2xlYW4obm9kZS5wcm9wZXJ0aWVzPy5pZClcbiAgICAgIH0sXG4gICAgfSlcbiAgICAudXNlKHJlaHlwZVN0cmluZ2lmeSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVByb2Nlc3NvcnMoXG4gIHRoZW1lOlxuICAgIHwgVGhlbWVcbiAgICB8IHtcbiAgICAgICAgbGlnaHQ6IFRoZW1lXG4gICAgICAgIGRhcms6IFRoZW1lXG4gICAgICB9XG4pOiBQcm9taXNlPHsgbGlnaHQ6IFByb2Nlc3NvcjsgZGFyazogUHJvY2Vzc29yIH0+IHtcbiAgcmV0dXJuIHtcbiAgICBsaWdodDogYXdhaXQgY3JlYXRlUHJvY2Vzc29yKHR5cGVvZiB0aGVtZSA9PT0gJ3N0cmluZycgPyB0aGVtZSA6IHRoZW1lLmxpZ2h0KSxcbiAgICBkYXJrOiBhd2FpdCBjcmVhdGVQcm9jZXNzb3IodHlwZW9mIHRoZW1lID09PSAnc3RyaW5nJyA/IHRoZW1lIDogdGhlbWUuZGFyayksXG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGV2L015IFJlcG9zZS92bXMuYXJlei5pby13ZWIgQmFja1VwLVNFRS1TRXIvdml0ZS1wbHVnaW4tdnVlcm8tZG9jXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kZXYvTXkgUmVwb3NlL3Ztcy5hcmV6LmlvLXdlYiBCYWNrVXAtU0VFLVNFci92aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rldi9NeSUyMFJlcG9zZS92bXMuYXJlei5pby13ZWIlMjBCYWNrVXAtU0VFLVNFci92aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzXCI7aW1wb3J0IHsga2ViYWJDYXNlIH0gZnJvbSAnc2N1bGUnXG5cbmNvbnN0IFNFTEZfQ0xPU0lOR19UQUdfUkVHRVggPSAvPChbXlxccz48L10rKShbXj5dKylcXC8+L2dcbmNvbnN0IE9QRU5fVEFHX1JFR0VYID0gLzwoW15cXHM+PC9dKykvZ1xuY29uc3QgQ0xPU0VfVEFHX1JFR0VYID0gLzxcXC8oW15cXHM+PC9dKykvZ1xuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtRXhhbXBsZU1hcmt1cChyYXc6IHN0cmluZykge1xuICBsZXQgb3V0cHV0ID0gcmF3XG4gIGxldCBjb250ZW50OiBSZWdFeHBNYXRjaEFycmF5IHwgbnVsbCA9IG51bGxcbiAgaWYgKChjb250ZW50ID0gcmF3Lm1hdGNoKC88IS0tZXhhbXBsZS0tPihbXFxzXFxTXSo/KTwhLS1cXC9leGFtcGxlLS0+LykpKSB7XG4gICAgY29uc3Qga2ViYWJDb250ZW50ID0gY29udGVudFsxXVxuICAgICAgLnJlcGxhY2VBbGwoU0VMRl9DTE9TSU5HX1RBR19SRUdFWCwgKHN1YnN0cmluZywgdGFnKSA9PiB7XG4gICAgICAgIHJldHVybiBzdWJzdHJpbmcucmVwbGFjZSgnLz4nLCBgPjwvJHt0YWcudHJpbSgpfT5gKVxuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlQWxsKE9QRU5fVEFHX1JFR0VYLCAoc3Vic3RyaW5nKSA9PiB7XG4gICAgICAgIHJldHVybiBgPCR7a2ViYWJDYXNlKHN1YnN0cmluZy5zdWJzdHJpbmcoMSkudHJpbSgpKX1gXG4gICAgICB9KVxuICAgICAgLnJlcGxhY2VBbGwoQ0xPU0VfVEFHX1JFR0VYLCAoc3Vic3RyaW5nKSA9PiB7XG4gICAgICAgIHJldHVybiBgPC8ke2tlYmFiQ2FzZShzdWJzdHJpbmcuc3Vic3RyaW5nKDIpLnRyaW0oKSl9YFxuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlQWxsKCcmI3gyNzsnLCBcIidcIilcblxuICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKGNvbnRlbnRbMV0sIGtlYmFiQ29udGVudClcbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybVNsb3RzKHNvdXJjZTogc3RyaW5nLCBjb25kaXRpb246IHN0cmluZyA9ICcnKSB7XG4gIGlmIChzb3VyY2UuaW5jbHVkZXMoJzwhLS1jb2RlLS0+JykgJiYgc291cmNlLmluY2x1ZGVzKCc8IS0tZXhhbXBsZS0tPicpKSB7XG4gICAgcmV0dXJuIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNkZWZhdWx0PiR7c291cmNlfWBcbiAgICAgIC5yZXBsYWNlKFxuICAgICAgICBgPCEtLWNvZGUtLT5gLFxuICAgICAgICBgPC90ZW1wbGF0ZT48dGVtcGxhdGUgJHtjb25kaXRpb259ICNjb2RlPlxcbjxzbG90IG5hbWU9XCJjb2RlXCI+PGRpdiB2LXByZT5gXG4gICAgICApXG4gICAgICAucmVwbGFjZShgPCEtLS9jb2RlLS0+YCwgYDwvZGl2Pjwvc2xvdD5cXG48L3RlbXBsYXRlPmApXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS1leGFtcGxlLS0+YCxcbiAgICAgICAgYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2V4YW1wbGU+XFxuPHNsb3QgbmFtZT1cImV4YW1wbGVcIj5gXG4gICAgICApXG4gICAgICAucmVwbGFjZShgPCEtLS9leGFtcGxlLS0+YCwgYDwvc2xvdD5cXG48L3RlbXBsYXRlPmApXG4gIH1cblxuICBpZiAoc291cmNlLmluY2x1ZGVzKCc8IS0tY29kZS0tPicpKSB7XG4gICAgcmV0dXJuIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNkZWZhdWx0PiR7c291cmNlfWBcbiAgICAgIC5yZXBsYWNlKFxuICAgICAgICBgPCEtLWNvZGUtLT5gLFxuICAgICAgICBgPC90ZW1wbGF0ZT48dGVtcGxhdGUgJHtjb25kaXRpb259ICNjb2RlPlxcbjxzbG90IG5hbWU9XCJjb2RlXCI+PGRpdiB2LXByZT5gXG4gICAgICApXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS0vY29kZS0tPmAsXG4gICAgICAgIGA8L2Rpdj48L3Nsb3Q+XFxuPC90ZW1wbGF0ZT5cXG48dGVtcGxhdGUgJHtjb25kaXRpb259ICNleGFtcGxlPjxzbG90IG5hbWU9XCJleGFtcGxlXCI+PC9zbG90PjwvdGVtcGxhdGU+YFxuICAgICAgKVxuICB9XG5cbiAgaWYgKHNvdXJjZS5pbmNsdWRlcygnPCEtLWV4YW1wbGUtLT4nKSkge1xuICAgIHJldHVybiBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZGVmYXVsdD4ke3NvdXJjZX1gXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS1leGFtcGxlLS0+YCxcbiAgICAgICAgYDwvdGVtcGxhdGU+PHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZXhhbXBsZT5cXG48c2xvdCBuYW1lPVwiZXhhbXBsZVwiPmBcbiAgICAgIClcbiAgICAgIC5yZXBsYWNlKFxuICAgICAgICBgPCEtLS9leGFtcGxlLS0+YCxcbiAgICAgICAgYDwvc2xvdD5cXG48L3RlbXBsYXRlPlxcbjx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2NvZGU+PHNsb3QgbmFtZT1cImNvZGVcIj48L3Nsb3Q+PC90ZW1wbGF0ZT5gXG4gICAgICApXG4gIH1cblxuICByZXR1cm4gKFxuICAgIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNkZWZhdWx0PiR7c291cmNlfTwvdGVtcGxhdGU+YCArXG4gICAgYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2V4YW1wbGU+PHNsb3QgbmFtZT1cImV4YW1wbGVcIj48L3Nsb3Q+PC90ZW1wbGF0ZT5gICtcbiAgICBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjY29kZT48c2xvdCBuYW1lPVwiY29kZVwiPjwvc2xvdD48L3RlbXBsYXRlPmBcbiAgKVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXYvTXkgUmVwb3NlL3Ztcy5hcmV6LmlvLXdlYiBCYWNrVXAtU0VFLVNFci92aXRlLXBsdWdpbi1wdXJnZS1jb21tZW50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV2L015IFJlcG9zZS92bXMuYXJlei5pby13ZWIgQmFja1VwLVNFRS1TRXIvdml0ZS1wbHVnaW4tcHVyZ2UtY29tbWVudHMvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZGV2L015JTIwUmVwb3NlL3Ztcy5hcmV6LmlvLXdlYiUyMEJhY2tVcC1TRUUtU0VyL3ZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IE1hZ2ljU3RyaW5nIGZyb20gJ21hZ2ljLXN0cmluZydcblxuZnVuY3Rpb24gcGFyc2VJZChpZDogc3RyaW5nKSB7XG4gIGNvbnN0IGluZGV4ID0gaWQuaW5kZXhPZignPycpXG4gIGlmIChpbmRleCA8IDApIHJldHVybiBpZFxuICBlbHNlIHJldHVybiBpZC5zbGljZSgwLCBpbmRleClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQbHVnaW5PcHRpb25zIHtcbiAgc291cmNlbWFwPzogYm9vbGVhblxufVxuXG4vKipcbiAqIFRoaXMgcGx1Z2luIHJlbW92ZXMgSFRNTCBjb21tZW50cyBmcm9tIHlvdXIgY29kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFZpdGVQbHVnaW5QdXJnZUNvbW1lbnRzKHsgc291cmNlbWFwID0gZmFsc2UgfTogUGx1Z2luT3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3B1cmdlLWNvbW1lbnRzJyxcbiAgICBlbmZvcmNlOiAncHJlJyxcbiAgICB0cmFuc2Zvcm06IChjb2RlLCBpZCkgPT4ge1xuICAgICAgY29uc3QgcGFyc2VkSWQgPSBwYXJzZUlkKGlkKVxuICAgICAgaWYgKFxuICAgICAgICAhKFxuICAgICAgICAgIHBhcnNlZElkLmVuZHNXaXRoKCcudnVlJykgfHxcbiAgICAgICAgICBwYXJzZWRJZC5lbmRzV2l0aCgnLmh0bWwnKSB8fFxuICAgICAgICAgIHBhcnNlZElkLmVuZHNXaXRoKCcuc3ZnJylcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgaWYgKCFjb2RlLmluY2x1ZGVzKCc8IS0tJykpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHMgPSBuZXcgTWFnaWNTdHJpbmcoY29kZSlcbiAgICAgIHMucmVwbGFjZSgvPCEtLVtcXHdcXFdcXHNdKj8tLT4vZywgJycpXG5cbiAgICAgIGlmIChzLmhhc0NoYW5nZWQoKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvZGU6IHMudG9TdHJpbmcoKSxcbiAgICAgICAgICBtYXA6IHNvdXJjZW1hcCAmJiAocy5nZW5lcmF0ZU1hcCh7IHNvdXJjZTogaWQsIGluY2x1ZGVDb250ZW50OiB0cnVlIH0pIGFzIGFueSksXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICB9IHNhdGlzZmllcyBQbHVnaW5cbn1cbiJdLAogICJt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LGVBQWUsS0FBSyxLQUFLLEtBQUs7QUFBQTtBQUFBLGNBQ2hDO0FBQUEsY0FDQSxtQkFBbUI7QUFBQSxnQkFDakIsVUFBVSxDQUFDLEdBQUcsR0FBRztBQUFBLGNBQ25CO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTO0FBQUEsY0FDUCxXQUFXO0FBQUEsY0FDWCxZQUFZO0FBQUEsZ0JBQ1YsWUFBWTtBQUFBLGdCQUNaLGVBQWUsS0FBSyxLQUFLLEtBQUs7QUFBQTtBQUFBLGNBQ2hDO0FBQUEsY0FDQSxtQkFBbUI7QUFBQSxnQkFDakIsVUFBVSxDQUFDLEdBQUcsR0FBRztBQUFBLGNBQ25CO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBUUQsU0FBUztBQUFBLE1BQ1AsUUFBUTtBQUFBLE1BQ1IsU0FBUyxDQUFDLGdCQUFnQjtBQUFBLE1BQzFCLFdBQVc7QUFBQSxNQUNYLFVBQVU7QUFBQSxRQUNSLFVBQVU7QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxpQkFBaUIsU0FBUztBQUN4QixjQUFNLDRCQUE0QixRQUFRLFFBQVEsMEJBQTBCLEVBQUU7QUFDOUUsZUFBTywwQkFBMEIsTUFBTSxrQ0FBa0MsS0FBSyxDQUFDO0FBQUEsTUFDakY7QUFBQSxJQUNGLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPRCxDQUFDLGdCQUNHLFNBQ0EsU0FBUztBQUFBLE1BQ1AsVUFBVTtBQUFBLFFBQ1IsbUJBQW1CO0FBQUEsUUFDbkIsWUFBWTtBQUFBLE1BQ2Q7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLG1CQUFtQjtBQUFBLE1BQ3JCO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1IsU0FBUyxDQUFDLEtBQUssR0FBRztBQUFBLFFBQ2xCLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDSixTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sUUFBUTtBQUFBLFVBQ1Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixRQUFRO0FBQUEsVUFDVjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDUDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhcnNlSWQiXQp9Cg==
