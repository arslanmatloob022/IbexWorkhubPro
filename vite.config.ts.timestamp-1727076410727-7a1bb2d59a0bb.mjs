// vite.config.ts
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/vite/dist/node/index.js";
import Vue from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/unplugin-vue-router/dist/vite.mjs";
import { VueRouterAutoImports } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/unplugin-vue-router/dist/index.mjs";
import Components from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/unplugin-auto-import/dist/vite.js";
import Unfonts from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/unplugin-fonts/dist/vite.mjs";
import { VitePluginRadar } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/vite-plugin-radar/dist/index.js";
import PurgeIcons from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import ImageMin from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/vite-plugin-imagemin/dist/index.mjs";
import VueI18nPlugin from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { VitePWA } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/vite-plugin-pwa/dist/index.js";
import purgecss from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/rollup-plugin-purgecss/lib/rollup-plugin-purgecss.js";
import UnheadVite from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/@unhead/addons/dist/vite.mjs";
import { unheadVueComposablesImports } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/@unhead/vue/dist/index.mjs";

// vite-plugin-vuero-doc/index.ts
import { join, basename } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/pathe/dist/index.mjs";
import { compileTemplate, parse } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js";

// vite-plugin-vuero-doc/markdown.ts
import yaml from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/js-yaml/dist/js-yaml.mjs";
import remarkShiki from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/@stefanprobst/remark-shiki/src/index.js";
import rehypeExternalLinks from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/rehype-external-links/index.js";
import rehypeRaw from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/rehype-raw/index.js";
import rehypeSlug from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/rehype-slug/index.js";
import rehypeAutolinkHeadings from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/rehype-autolink-headings/index.js";
import rehypeStringify from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/rehype-stringify/index.js";
import remarkParse from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/remark-parse/index.js";
import remarkGfm from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/remark-gfm/index.js";
import remarkRehype from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/remark-rehype/index.js";
import remarkFrontmatter from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/remark-frontmatter/index.js";
import { getHighlighter } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/shiki/dist/index.js";
import { unified } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/unified/index.js";
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
import { kebabCase } from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/scule/dist/index.mjs";
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
import MagicString from "file:///home/dev/Music/NewFolder/MyWorkSpace/IbexWorkhubPro/node_modules/magic-string/dist/magic-string.es.mjs";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4tdnVlcm8tZG9jL2luZGV4LnRzIiwgInZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9tYXJrZG93bi50cyIsICJ2aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzIiwgInZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgVnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSBcInVucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZVwiO1xuaW1wb3J0IHsgVnVlUm91dGVyQXV0b0ltcG9ydHMgfSBmcm9tIFwidW5wbHVnaW4tdnVlLXJvdXRlclwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XG5pbXBvcnQgVW5mb250cyBmcm9tIFwidW5wbHVnaW4tZm9udHMvdml0ZVwiO1xuaW1wb3J0IHsgVml0ZVBsdWdpblJhZGFyIH0gZnJvbSBcInZpdGUtcGx1Z2luLXJhZGFyXCI7XG5pbXBvcnQgUHVyZ2VJY29ucyBmcm9tIFwidml0ZS1wbHVnaW4tcHVyZ2UtaWNvbnNcIjtcbmltcG9ydCBJbWFnZU1pbiBmcm9tIFwidml0ZS1wbHVnaW4taW1hZ2VtaW5cIjtcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gXCJAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlXCI7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xuaW1wb3J0IHB1cmdlY3NzIGZyb20gXCJyb2xsdXAtcGx1Z2luLXB1cmdlY3NzXCI7XG5pbXBvcnQgVW5oZWFkVml0ZSBmcm9tIFwiQHVuaGVhZC9hZGRvbnMvdml0ZVwiO1xuaW1wb3J0IHsgdW5oZWFkVnVlQ29tcG9zYWJsZXNJbXBvcnRzIH0gZnJvbSBcIkB1bmhlYWQvdnVlXCI7XG5cbi8vIGxvY2FsIHZpdGUgcGx1Z2luXG5pbXBvcnQgeyBWaXRlUGx1Z2luVnVlcm9Eb2MgfSBmcm9tIFwiLi92aXRlLXBsdWdpbi12dWVyby1kb2NcIjtcbmltcG9ydCB7IFZpdGVQbHVnaW5QdXJnZUNvbW1lbnRzIH0gZnJvbSBcIi4vdml0ZS1wbHVnaW4tcHVyZ2UtY29tbWVudHNcIjtcblxuLy8gb3B0aW9ucyB2aWEgZW52IHZhcmlhYmxlc1xuY29uc3QgTUlOSUZZX0lNQUdFUyA9IHByb2Nlc3MuZW52Lk1JTklGWVxuICA/IHByb2Nlc3MuZW52Lk1JTklGWSA9PT0gXCJ0cnVlXCJcbiAgOiBmYWxzZTtcblxuY29uc3QgaXNQcm9kID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIG1haW4gY29uZmlndXJhdGlvbiBmaWxlIGZvciB2aXRlanNcbiAqXG4gKiBAc2VlIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgLy8gUHJvamVjdCByb290IGRpcmVjdG9yeSAod2hlcmUgaW5kZXguaHRtbCBpcyBsb2NhdGVkKS5cbiAgcm9vdDogcHJvY2Vzcy5jd2QoKSxcbiAgLy8gQmFzZSBwdWJsaWMgcGF0aCB3aGVuIHNlcnZlZCBpbiBkZXZlbG9wbWVudCBvciBwcm9kdWN0aW9uLlxuICAvLyBZb3UgYWxzbyBuZWVkIHRvIGFkZCB0aGlzIGJhc2UgbGlrZSBgaGlzdG9yeTogY3JlYXRlV2ViSGlzdG9yeSgnbXktc3ViZGlyZWN0b3J5JylgXG4gIC8vIGluIC4vc3JjL3JvdXRlci50c1xuICAvLyBiYXNlOiAnL215LXN1YmRpcmVjdG9yeS8nLFxuICBiYXNlOiBcIi9cIixcbiAgLy8gRGlyZWN0b3J5IHRvIHNlcnZlIGFzIHBsYWluIHN0YXRpYyBhc3NldHMuXG4gIHB1YmxpY0RpcjogXCJwdWJsaWNcIixcbiAgLy8gQWRqdXN0IGNvbnNvbGUgb3V0cHV0IHZlcmJvc2l0eS5cbiAgbG9nTGV2ZWw6IFwiaW5mb1wiLFxuICAvLyBkZXZlbG9wbWVudCBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICBzZXJ2ZXI6IHtcbiAgICAvLyBWaXRlIDQgZGVmYXVsdHMgdG8gNTE3MywgYnV0IHlvdSBjYW4gb3ZlcnJpZGUgaXQgd2l0aCB0aGUgcG9ydCBvcHRpb24uXG4gICAgcG9ydDogMzAwMCxcbiAgfSxcbiAgLyoqXG4gICAqIERlZmluZSBhbGxvdyB0byByZXBsYWNlIHN0cmluZyBpbiB0aGUgY29kZSBhdCBidWlsZCB0aW1lLlxuICAgKi9cbiAgZGVmaW5lOiB7XG4gICAgLy8gVlNDT0RFX1RFWFRNQVRFX0RFQlVHIGlzIHVzZWQgaW4gc2hpa2ksIGJ1dCBpdCdzIG5vdCBkZWZpbmVkIGluIHRoZSBicm93c2VyXG4gICAgXCJwcm9jZXNzLmVudi5WU0NPREVfVEVYVE1BVEVfREVCVUdcIjogXCJmYWxzZVwiLFxuICB9LFxuICAvKipcbiAgICogQnkgZGVmYXVsdCwgVml0ZSB3aWxsIGNyYXdsIHlvdXIgaW5kZXguaHRtbCB0byBkZXRlY3QgZGVwZW5kZW5jaWVzIHRoYXRcbiAgICogbmVlZCB0byBiZSBwcmUtYnVuZGxlZC4gSWYgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dCBpcyBzcGVjaWZpZWQsXG4gICAqIFZpdGUgd2lsbCBjcmF3bCB0aG9zZSBlbnRyeSBwb2ludHMgaW5zdGVhZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnLyNvcHRpbWl6ZWRlcHMtZW50cmllc1xuICAgKi9cbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgXCJAY2tlZGl0b3IvY2tlZGl0b3I1LXZ1ZVwiLFxuICAgICAgXCJAY2tlZGl0b3IvY2tlZGl0b3I1LWJ1aWxkLWNsYXNzaWNcIixcbiAgICAgIFwiQGljb25pZnkvaWNvbmlmeVwiLFxuICAgICAgXCJAbWFwYm94L21hcGJveC1nbC1nZW9jb2Rlci9kaXN0L21hcGJveC1nbC1nZW9jb2Rlci5taW4uanNcIixcbiAgICAgIFwiQHZlZS12YWxpZGF0ZS96b2RcIixcbiAgICAgIFwiQHZ1ZXVzZS9jb3JlXCIsXG4gICAgICBcIkB2dWVmb3JtL211bHRpc2VsZWN0XCIsXG4gICAgICBcIkB2dWVmb3JtL3NsaWRlclwiLFxuICAgICAgXCJiaWxsYm9hcmQuanNcIixcbiAgICAgIFwiZGF5anNcIixcbiAgICAgIFwiZHJvcHpvbmVcIixcbiAgICAgIFwiZHJhZ3VsYVwiLFxuICAgICAgXCJkZWZ1XCIsXG4gICAgICBcImZpbGVwb25kXCIsXG4gICAgICBcImZpbGVwb25kLXBsdWdpbi1maWxlLXZhbGlkYXRlLXNpemVcIixcbiAgICAgIFwiZmlsZXBvbmQtcGx1Z2luLWZpbGUtdmFsaWRhdGUtdHlwZVwiLFxuICAgICAgXCJmaWxlcG9uZC1wbHVnaW4taW1hZ2UtZXhpZi1vcmllbnRhdGlvblwiLFxuICAgICAgXCJmaWxlcG9uZC1wbHVnaW4taW1hZ2UtY3JvcFwiLFxuICAgICAgXCJmaWxlcG9uZC1wbHVnaW4taW1hZ2UtZWRpdFwiLFxuICAgICAgXCJmaWxlcG9uZC1wbHVnaW4taW1hZ2UtcHJldmlld1wiLFxuICAgICAgXCJmaWxlcG9uZC1wbHVnaW4taW1hZ2UtcmVzaXplXCIsXG4gICAgICBcImZpbGVwb25kLXBsdWdpbi1pbWFnZS10cmFuc2Zvcm1cIixcbiAgICAgIFwiZm9jdXMtdHJhcC12dWVcIixcbiAgICAgIFwiaW1hc2tcIixcbiAgICAgIFwibnByb2dyZXNzXCIsXG4gICAgICBcIm5vdHlmXCIsXG4gICAgICBcIm1hcGJveC1nbFwiLFxuICAgICAgXCJwaG90b3N3aXBlL2xpZ2h0Ym94XCIsXG4gICAgICBcInBob3Rvc3dpcGVcIixcbiAgICAgIFwicGx5clwiLFxuICAgICAgXCJ2LWNhbGVuZGFyXCIsXG4gICAgICBcInZlZS12YWxpZGF0ZVwiLFxuICAgICAgXCJ2dWVcIixcbiAgICAgIFwidnVlLXNjcm9sbHRvXCIsXG4gICAgICBcInZ1ZTMtYXBleGNoYXJ0c1wiLFxuICAgICAgXCJ2dWUtdGlwcHlcIixcbiAgICAgIFwidnVlLWkxOG5cIixcbiAgICAgIFwidnVlLXJvdXRlclwiLFxuICAgICAgXCJ1bnBsdWdpbi12dWUtcm91dGVyL3J1bnRpbWVcIixcbiAgICAgIFwic2ltcGxlYmFyXCIsXG4gICAgICBcInRpbnktc2xpZGVyL3NyYy90aW55LXNsaWRlclwiLFxuICAgICAgXCJ2dWUtYWNjZXNzaWJsZS1jb2xvci1waWNrZXJcIixcbiAgICAgIFwiem9kXCIsXG4gICAgICBcIkBzdGVmYW5wcm9ic3QvcmVtYXJrLXNoaWtpXCIsXG4gICAgICBcInJlaHlwZS1leHRlcm5hbC1saW5rc1wiLFxuICAgICAgXCJyZWh5cGUtcmF3XCIsXG4gICAgICBcInJlaHlwZS1zYW5pdGl6ZVwiLFxuICAgICAgXCJyZWh5cGUtc3RyaW5naWZ5XCIsXG4gICAgICBcInJlaHlwZS1zbHVnXCIsXG4gICAgICBcInJlaHlwZS1hdXRvbGluay1oZWFkaW5nc1wiLFxuICAgICAgXCJyZW1hcmstZ2ZtXCIsXG4gICAgICBcInJlbWFyay1wYXJzZVwiLFxuICAgICAgXCJyZW1hcmstcmVoeXBlXCIsXG4gICAgICBcInNoaWtpXCIsXG4gICAgICBcInVuaWZpZWRcIixcbiAgICAgIFwid29ya2JveC13aW5kb3dcIixcbiAgICAgIFwidGV4dGFyZWEtbWFya2Rvd24tZWRpdG9yL2Rpc3QvZXNtL2Jvb3RzdHJhcFwiLFxuICAgIF0sXG4gICAgLy8gZGlzYWJsZWQ6IGZhbHNlLFxuICB9LFxuICAvLyBXaWxsIGJlIHBhc3NlZCB0byBAcm9sbHVwL3BsdWdpbi1hbGlhcyBhcyBpdHMgZW50cmllcyBvcHRpb24uXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiBcIi9Ac3JjL1wiLFxuICAgICAgICByZXBsYWNlbWVudDogYC9zcmMvYCxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6IFwiZXNuZXh0XCIsXG4gICAgbWluaWZ5OiBcInRlcnNlclwiLFxuICAgIC8vIERvIG5vdCB3YXJuIGFib3V0IGxhcmdlIGNodW5rc1xuICAgIC8vIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogSW5maW5pdHksXG4gICAgLy8gRG91YmxlIHRoZSBkZWZhdWx0IHNpemUgdGhyZXNob2xkIGZvciBpbmxpbmVkIGFzc2V0c1xuICAgIC8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvYnVpbGQtb3B0aW9ucy5odG1sI2J1aWxkLWFzc2V0c2lubGluZWxpbWl0XG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYgKiAyLFxuICAgIC8vIGNvbW1vbmpzT3B0aW9uczogeyBpbmNsdWRlOiBbXSB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgLyoqXG4gICAgICogcGx1Z2luLXZ1ZSBwbHVnaW4gaW5qZWN0IHZ1ZSBsaWJyYXJ5IGFuZCBhbGxvdyBzZmMgZmlsZXMgdG8gd29yayAoKi52dWUpXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlanMvdml0ZS90cmVlL21haW4vcGFja2FnZXMvcGx1Z2luLXZ1ZVxuICAgICAqL1xuICAgIFZ1ZSh7XG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvXSxcbiAgICAgIHNjcmlwdDoge1xuICAgICAgICBkZWZpbmVNb2RlbDogdHJ1ZSxcbiAgICAgICAgcHJvcHNEZXN0cnVjdHVyZTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB1bnBsdWdpbi12dWUtaTE4biBwbHVnaW4gZG9lcyBpMThuIHJlc291cmNlcyBwcmUtY29tcGlsYXRpb24gLyBvcHRpbWl6YXRpb25zXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9pbnRsaWZ5L2J1bmRsZS10b29scy9ibG9iL21haW4vcGFja2FnZXMvdW5wbHVnaW4tdnVlLWkxOG4vUkVBRE1FLm1kXG4gICAgICovXG4gICAgVnVlSTE4blBsdWdpbih7XG4gICAgICBpbmNsdWRlOiByZXNvbHZlKFxuICAgICAgICBkaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAgIFwiLi9zcmMvbG9jYWxlcy8qKlwiXG4gICAgICApLFxuICAgICAgZnVsbEluc3RhbGw6IGZhbHNlLFxuICAgICAgY29tcG9zaXRpb25Pbmx5OiB0cnVlLFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdW5wbHVnaW4tdnVlLXJvdXRlciBwbHVnaW4gZ2VuZXJhdGUgcm91dGVzIGJhc2VkIG9uIGZpbGUgc3lzdGVtXG4gICAgICogYWxsb3cgdG8gdXNlIHR5cGVkIHJvdXRlcyBhbmQgdXNhZ2Ugb2YgZGVmaW5lTG9hZGVyXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3N2YS91bnBsdWdpbi12dWUtcm91dGVyXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvcmZjcy9ibG9iL2FkNjlkYTJhZWU5MjQyZWY4OGYwMzY3MTNkYjY4ZjNlZjI3NGJiMWIvYWN0aXZlLXJmY3MvMDAwMC1yb3V0ZXItdXNlLWxvYWRlci5tZFxuICAgICAqL1xuICAgIFZ1ZVJvdXRlcih7XG4gICAgICByb3V0ZXNGb2xkZXI6IFwic3JjL3BhZ2VzXCIsXG4gICAgICBkdHM6IFwiLi90eXBlcy9yb3V0ZXIuZC50c1wiLFxuXG4gICAgICAvKipcbiAgICAgICAqIERhdGEgRmV0Y2hpbmcgaXMgYW4gZXhwZXJpbWVudGFsIGZlYXR1cmUgZnJvbSB2dWUgJiB2dWUtcm91dGVyXG4gICAgICAgKlxuICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvcmZjcy9kaXNjdXNzaW9ucy80NjBcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bvc3ZhL3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdHJlZS9tYWluL3NyYy9kYXRhLWZldGNoaW5nXG4gICAgICAgKi9cbiAgICAgIGRhdGFGZXRjaGluZzogdHJ1ZSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIFVuaGVhZCBwcm92aWRlcyBhIFZpdGUgcGx1Z2luIHRvIG9wdGltaXNlIHlvdXIgYnVpbGRzLCBieSByZW1vdmluZyBjb21wb3NhYmxlcyB0aGF0IGFyZW4ndCBuZWVkZWQgYW5kIHNpbXBsaWZ5aW5nIHlvdXIgY29kZS5cbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly91bmhlYWQuaGFybGFuencuY29tL2d1aWRlL2dldHRpbmctc3RhcnRlZC92aXRlLXBsdWdpblxuICAgICAqL1xuICAgIFVuaGVhZFZpdGUoKSxcblxuICAgIC8qKlxuICAgICAqIHVucGx1Z2luLWF1dG8taW1wb3J0IGFsbG93IHRvIGF1dG9tYXRpY2FseSBpbXBvcnQgbW9kdWxlcy9jb21wb25lbnRzXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydFxuICAgICAqL1xuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgZHRzOiBcIi4vdHlwZXMvaW1wb3J0cy5kLnRzXCIsXG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgIFwidnVlXCIsXG4gICAgICAgIFwiQHZ1ZXVzZS9jb3JlXCIsXG4gICAgICAgIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLFxuICAgICAgICB1bmhlYWRWdWVDb21wb3NhYmxlc0ltcG9ydHMsXG4gICAgICBdLFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBhbiBpbnRlcm5hbCB2aXRlIHBsdWdpbiB0aGF0IGxvYWQgbWFya2Rvd24gZmlsZXMgYXMgdnVlIGNvbXBvbmVudHMuXG4gICAgICpcbiAgICAgKiBAc2VlIC9kb2N1bWVudGF0aW9uXG4gICAgICogQHNlZSAvdml0ZS1wbHVnaW4tdnVlcm8tZG9jXG4gICAgICogQHNlZSAvc3JjL2NvbXBvbmVudHMvcGFydGlhbHMvZG9jdW1lbnRhdGlvbi9Eb2N1bWVudGF0aW9uSXRlbS52dWVcbiAgICAgKiBAc2VlIC9zcmMvY29tcG9zYWJsZS91c2VNYXJrZG93blRvYy50c1xuICAgICAqL1xuICAgIFZpdGVQbHVnaW5WdWVyb0RvYyh7XG4gICAgICBwYXRoUHJlZml4OiBcImRvY3VtZW50YXRpb25cIixcbiAgICAgIHdyYXBwZXJDb21wb25lbnQ6IFwiRG9jdW1lbnRhdGlvbkl0ZW1cIixcbiAgICAgIHNoaWtpOiB7XG4gICAgICAgIHRoZW1lOiB7XG4gICAgICAgICAgbGlnaHQ6IFwibWluLWxpZ2h0XCIsXG4gICAgICAgICAgZGFyazogXCJnaXRodWItZGFya1wiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNvdXJjZU1ldGE6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZWRpdFByb3RvY29sOiBcInZzY29kZTovL3ZzY29kZS1yZW1vdGUvd3NsK1VidW50dVwiLCAvLyBvciAndnNjb2RlOi8vZmlsZSdcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGFuIGludGVybmFsIHZpdGUgcGx1Z2luIHRoYXQgcmVtb3ZlIGh0bWwgY29tbWVudHMgZnJvbSBjb2RlLlxuICAgICAqXG4gICAgICogQHNlZSAvdml0ZS1wbHVnaW4tcHVyZ2UtY29tbWVudHNcbiAgICAgKi9cbiAgICBWaXRlUGx1Z2luUHVyZ2VDb21tZW50cygpLFxuXG4gICAgLyoqXG4gICAgICogdW5wbHVnaW4tdnVlLWNvbXBvbmVudHMgcGx1Z2luIGlzIHJlc3BvbnNpYmxlIG9mIGF1dG9sb2FkaW5nIGNvbXBvbmVudHNcbiAgICAgKiBkb2N1bWVudGF0aW9uIGFuZCBtZCBmaWxlIGFyZSBsb2FkZWQgZm9yIGVsZW1lbnRzIGFuZCBjb21wb25lbnRzIHNlY3Rpb25zXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi12dWUtY29tcG9uZW50c1xuICAgICAqL1xuICAgIENvbXBvbmVudHMoe1xuICAgICAgZGlyczogW1wiZG9jdW1lbnRhdGlvblwiLCBcInNyYy9jb21wb25lbnRzXCIsIFwic3JjL2xheW91dHNcIl0sXG4gICAgICBleHRlbnNpb25zOiBbXCJ2dWVcIiwgXCJtZFwiXSxcbiAgICAgIGR0czogXCIuL3R5cGVzL2NvbXBvbmVudHMuZC50c1wiLFxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvXSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHZpdGUtcGx1Z2luLXB1cmdlLWljb25zIHBsdWdpbiBpcyByZXNwb25zaWJsZSBvZiBhdXRvbG9hZGluZyBpY29uZXMgZnJvbSBtdWx0aXBsZXMgcHJvdmlkZXJzXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vaWNvbmVzLm5ldGxpZnkuYXBwL1xuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3B1cmdlLWljb25zL3RyZWUvbWFpbi9wYWNrYWdlcy92aXRlLXBsdWdpbi1wdXJnZS1pY29uc1xuICAgICAqL1xuICAgIFB1cmdlSWNvbnMoKSxcblxuICAgIC8qKlxuICAgICAqIHZpdGUtcGx1Z2luLWZvbnRzIHBsdWdpbiBpbmplY3Qgd2ViZm9udHMgZnJvbSBkaWZmZXJlbnRzIHByb3ZpZGVyc1xuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3RhZnluaWFrc2FjaGEvdml0ZS1wbHVnaW4tZm9udHNcbiAgICAgKi9cbiAgICBVbmZvbnRzKHtcbiAgICAgIGdvb2dsZToge1xuICAgICAgICBmYW1pbGllczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiRmlyYSBDb2RlXCIsXG4gICAgICAgICAgICBzdHlsZXM6IFwid2dodEA0MDA7NjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIk1vbnRzZXJyYXRcIixcbiAgICAgICAgICAgIHN0eWxlczogXCJ3Z2h0QDUwMDs2MDA7NzAwOzgwMDs5MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiUm9ib3RvXCIsXG4gICAgICAgICAgICBzdHlsZXM6IFwid2dodEAzMDA7NDAwOzUwMDs2MDA7NzAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB2aXRlLXBsdWdpbi1yYWRhciBwbHVnaW4gaW5qZWN0IHNuaXBwZXRzIGZyb20gYW5hbHl0aWNzIHByb3ZpZGVyc1xuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3RhZnluaWFrc2FjaGEvdml0ZS1wbHVnaW4tcmFkYXJcbiAgICAgKi9cbiAgICAhcHJvY2Vzcy5lbnYuR1RNX0lEXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiBWaXRlUGx1Z2luUmFkYXIoe1xuICAgICAgICAgIGd0bToge1xuICAgICAgICAgICAgaWQ6IHByb2Nlc3MuZW52LkdUTV9JRCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHZpdGUtcGx1Z2luLXB3YSBnZW5lcmF0ZSBtYW5pZmVzdC5qc29uIGFuZCByZWdpc3RlciBzZXJ2aWNlcyB3b3JrZXIgdG8gZW5hYmxlIFBXQVxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tcHdhXG4gICAgICovXG4gICAgVml0ZVBXQSh7XG4gICAgICBiYXNlOiBcIi9cIixcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcbiAgICAgICAgXCJmYXZpY29uLnN2Z1wiLFxuICAgICAgICBcImZhdmljb24uaWNvXCIsXG4gICAgICAgIFwicm9ib3RzLnR4dFwiLFxuICAgICAgICBcImFwcGxlLXRvdWNoLWljb24ucG5nXCIsXG4gICAgICBdLFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogXCJJYmV4IC0gUmVhbC1Fc3RhdGUgQnVpbGRlcnNcIixcbiAgICAgICAgc2hvcnRfbmFtZTogXCJJYmV4XCIsXG4gICAgICAgIHN0YXJ0X3VybDogXCIvP3V0bV9zb3VyY2U9cHdhXCIsXG4gICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxuICAgICAgICB0aGVtZV9jb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJwd2EtMTkyeDE5Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwicHdhLTUxMng1MTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcInB3YS01MTJ4NTEyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICAgIHB1cnBvc2U6IFwiYW55IG1hc2thYmxlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBtb2RlOiBpc1Byb2QgPyBcInByb2R1Y3Rpb25cIiA6IFwiZGV2ZWxvcG1lbnRcIixcbiAgICAgIC8vIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgd29ya2JveDoge1xuICAgICAgICAvKipcbiAgICAgICAgICogcHJlY2FjaGUgZmlsZXMgdGhhdCBtYXRjaCB0aGUgZ2xvYiBwYXR0ZXJuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly92aXRlLXB3YS1vcmcubmV0bGlmeS5hcHAvZ3VpZGUvc2VydmljZS13b3JrZXItcHJlY2FjaGUuaHRtbFxuICAgICAgICAgKi9cbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLntqcyxjc3MsaWNvLHBuZyxzdmcsd2VicCxqcGcsanBlZ31cIl0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFkZCBleHRlcm5hbCBjYWNoZSBvZiBnb29nbGUgZm9udHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHNlZSBodHRwczovL3ZpdGUtcHdhLW9yZy5uZXRsaWZ5LmFwcC93b3JrYm94L2dlbmVyYXRlLXN3Lmh0bWxcbiAgICAgICAgICovXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdvb2dsZWFwaXNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogXCJDYWNoZUZpcnN0XCIsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogXCJnb29nbGUtZm9udHMtY2FjaGVcIixcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSwgLy8gPD09IDM2NSBkYXlzXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nc3RhdGljXFwuY29tXFwvLiovaSxcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6IFwiZ3N0YXRpYy1mb250cy1jYWNoZVwiLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAsXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1LCAvLyA8PT0gMzY1IGRheXNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogcm9sbHVwLXBsdWdpbi1wdXJnZWNzcyBwbHVnaW4gaXMgcmVzcG9uc2libGUgb2YgcHVyZ2luZyBjc3MgcnVsZXNcbiAgICAgKiB0aGF0IGFyZSBub3QgdXNlZCBpbiB0aGUgYnVuZGxlXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9GdWxsSHVtYW4vcHVyZ2Vjc3MvdHJlZS9tYWluL3BhY2thZ2VzL3JvbGx1cC1wbHVnaW4tcHVyZ2Vjc3NcbiAgICAgKi9cbiAgICBwdXJnZWNzcyh7XG4gICAgICBvdXRwdXQ6IGZhbHNlLFxuICAgICAgY29udGVudDogW2AuL3NyYy8qKi8qLnZ1ZWBdLFxuICAgICAgdmFyaWFibGVzOiBmYWxzZSxcbiAgICAgIHNhZmVsaXN0OiB7XG4gICAgICAgIHN0YW5kYXJkOiBbXG4gICAgICAgICAgLyhhdXR2fGxuaWx8bG5pcnxmYXM/KS8sXG4gICAgICAgICAgLy0obGVhdmV8ZW50ZXJ8YXBwZWFyKSh8LSh0b3xmcm9tfGFjdGl2ZSkpJC8sXG4gICAgICAgICAgL14oPyEofC4qPzopY3Vyc29yLW1vdmUpListbW92ZSQvLFxuICAgICAgICAgIC9ecm91dGVyLWxpbmsofC1leGFjdCktYWN0aXZlJC8sXG4gICAgICAgICAgL2RhdGEtdi0uKi8sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgZGVmYXVsdEV4dHJhY3Rvcihjb250ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRXaXRob3V0U3R5bGVCbG9ja3MgPSBjb250ZW50LnJlcGxhY2UoXG4gICAgICAgICAgLzxzdHlsZVteXSs/PFxcL3N0eWxlPi9naSxcbiAgICAgICAgICBcIlwiXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgY29udGVudFdpdGhvdXRTdHlsZUJsb2Nrcy5tYXRjaCgvW0EtWmEtejAtOS1fLzpdKltBLVphLXowLTktXy9dKy9nKSB8fFxuICAgICAgICAgIFtdXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdml0ZS1wbHVnaW4taW1hZ2VtaW4gb3B0aW1pemUgYWxsIGltYWdlcyBzaXplcyBmcm9tIHB1YmxpYyBvciBhc3NldCBmb2xkZXJcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FubmN3Yi92aXRlLXBsdWdpbi1pbWFnZW1pblxuICAgICAqL1xuICAgICFNSU5JRllfSU1BR0VTXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiBJbWFnZU1pbih7XG4gICAgICAgICAgZ2lmc2ljbGU6IHtcbiAgICAgICAgICAgIG9wdGltaXphdGlvbkxldmVsOiA3LFxuICAgICAgICAgICAgaW50ZXJsYWNlZDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvcHRpcG5nOiB7XG4gICAgICAgICAgICBvcHRpbWl6YXRpb25MZXZlbDogNyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1vempwZWc6IHtcbiAgICAgICAgICAgIHF1YWxpdHk6IDYwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcG5ncXVhbnQ6IHtcbiAgICAgICAgICAgIHF1YWxpdHk6IFswLjgsIDAuOV0sXG4gICAgICAgICAgICBzcGVlZDogNCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN2Z286IHtcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwicmVtb3ZlVmlld0JveFwiLFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInJlbW92ZUVtcHR5QXR0cnNcIixcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgXSxcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLXBsdWdpbi12dWVyby1kb2MvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLXBsdWdpbi12dWVyby1kb2MvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiwgUmVzb2x2ZWRDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHR5cGUgeyBQcm9jZXNzb3IgfSBmcm9tICd1bmlmaWVkJ1xuaW1wb3J0IHR5cGUgeyBUaGVtZSB9IGZyb20gJ3NoaWtpJ1xuXG5pbXBvcnQgeyBqb2luLCBiYXNlbmFtZSB9IGZyb20gJ3BhdGhlJ1xuaW1wb3J0IHsgY29tcGlsZVRlbXBsYXRlLCBwYXJzZSB9IGZyb20gJ0B2dWUvY29tcGlsZXItc2ZjJ1xuXG5pbXBvcnQgeyBjcmVhdGVQcm9jZXNzb3JzIH0gZnJvbSAnLi9tYXJrZG93bidcbmltcG9ydCB7IHRyYW5zZm9ybUV4YW1wbGVNYXJrdXAsIHRyYW5zZm9ybVNsb3RzIH0gZnJvbSAnLi90cmFuc2Zvcm0nXG5cbmZ1bmN0aW9uIHBhcnNlSWQoaWQ6IHN0cmluZykge1xuICBjb25zdCBpbmRleCA9IGlkLmluZGV4T2YoJz8nKVxuICBpZiAoaW5kZXggPCAwKSByZXR1cm4gaWRcbiAgZWxzZSByZXR1cm4gaWQuc2xpY2UoMCwgaW5kZXgpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGx1Z2luT3B0aW9ucyB7XG4gIHBhdGhQcmVmaXg/OiBzdHJpbmdcbiAgd3JhcHBlckNvbXBvbmVudDogc3RyaW5nXG4gIHNoaWtpOiB7XG4gICAgdGhlbWU6XG4gICAgICB8IFRoZW1lXG4gICAgICB8IHtcbiAgICAgICAgICBsaWdodDogVGhlbWVcbiAgICAgICAgICBkYXJrOiBUaGVtZVxuICAgICAgICB9XG4gIH1cbiAgc291cmNlTWV0YT86IHtcbiAgICBlbmFibGVkPzogYm9vbGVhblxuICAgIGVkaXRQcm90b2NvbD86IHN0cmluZ1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWaXRlUGx1Z2luVnVlcm9Eb2Mob3B0aW9uczogUGx1Z2luT3B0aW9ucykge1xuICBsZXQgY29uZmlnOiBSZXNvbHZlZENvbmZpZyB8IHVuZGVmaW5lZFxuICBsZXQgcHJvY2Vzc29yczogeyBsaWdodDogUHJvY2Vzc29yOyBkYXJrOiBQcm9jZXNzb3IgfSB8IHVuZGVmaW5lZFxuXG4gIGNvbnN0IGN3ZCA9IHByb2Nlc3MuY3dkKClcbiAgY29uc3QgcGF0aFByZWZpeCA9IG9wdGlvbnMucGF0aFByZWZpeCA/IGpvaW4oY3dkLCBvcHRpb25zLnBhdGhQcmVmaXgpIDogY3dkXG5cbiAgYXN5bmMgZnVuY3Rpb24gbWFya2Rvd25Ub1Z1ZShpZDogc3RyaW5nLCByYXc6IHN0cmluZykge1xuICAgIGNvbnN0IHBhdGggPSBwYXJzZUlkKGlkKVxuXG4gICAgLy8gdHJhbnNmb3JtIGV4YW1wbGUgbWFya3VwIHRvIHVzZSBrZWJhYi1jYXNlIHdpdGhvdXQgc2VsZi1jbG9zaW5nIGVsZW1lbnRzLlxuICAgIC8vIHRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgcmVoeXBlLXJhdyByZXF1aXJlcyB2YWxpZCBodG1sIChvbmx5IHNvbWUgdGFncyBhcmUgc2VsZi1jbG9zYWJsZSlcbiAgICBjb25zdCBpbnB1dCA9IHRyYW5zZm9ybUV4YW1wbGVNYXJrdXAocmF3KVxuXG4gICAgLy8gcHJvY2VzcyBtYXJrZG93biB3aXRoIHJlbWFya1xuICAgIGlmICghcHJvY2Vzc29ycykgcHJvY2Vzc29ycyA9IGF3YWl0IGNyZWF0ZVByb2Nlc3NvcnMob3B0aW9ucy5zaGlraS50aGVtZSlcblxuICAgIGNvbnN0IFt2RmlsZUxpZ2h0LCB2RmlsZURhcmtdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgcHJvY2Vzc29ycy5saWdodC5wcm9jZXNzKGlucHV0KSxcbiAgICAgIHByb2Nlc3NvcnMuZGFyay5wcm9jZXNzKGlucHV0KSxcbiAgICBdKVxuXG4gICAgY29uc3QgY29udGVudExpZ2h0ID0gdkZpbGVMaWdodC50b1N0cmluZygpXG4gICAgY29uc3QgY29udGVudERhcmsgPSB2RmlsZURhcmsudG9TdHJpbmcoKVxuICAgIGNvbnN0IGZyb250bWF0dGVyID0gdkZpbGVMaWdodC5kYXRhPy5mcm9udG1hdHRlciA/PyB7fVxuXG4gICAgLy8gcmVwbGFjZSBjb2RlL2V4YW1wbGUgc2xvdHMgcGxhY2Vob2xkZXJzXG4gICAgY29uc3Qgc2xvdExpZ2h0ID0gdHJhbnNmb3JtU2xvdHMoY29udGVudExpZ2h0LCAndi1pZj1cIiFkYXJrbW9kZS5pc0RhcmtcIicpXG4gICAgY29uc3Qgc2xvdERhcmsgPSB0cmFuc2Zvcm1TbG90cyhjb250ZW50RGFyaywgJ3YtaWY9XCJkYXJrbW9kZS5pc0RhcmtcIicpXG5cbiAgICAvLyB3cmFwIGNvbnRlbnQgaW4gd3JhcHBlciBjb21wb25lbnQgZGVmYXVsdCBzbG90XG4gICAgY29uc3Qgc2ZjID0gW1xuICAgICAgYDx0ZW1wbGF0ZT5gLFxuICAgICAgYCAgPCR7b3B0aW9ucy53cmFwcGVyQ29tcG9uZW50fSA6ZnJvbnRtYXR0ZXI9XCJmcm9udG1hdHRlclwiIDpzb3VyY2UtbWV0YT1cInNvdXJjZU1ldGFcIj5gLFxuICAgICAgYCAgICAke3Nsb3RMaWdodH1gLFxuICAgICAgYCAgICAke3Nsb3REYXJrfWAsXG4gICAgICBgICA8LyR7b3B0aW9ucy53cmFwcGVyQ29tcG9uZW50fT5gLFxuICAgICAgYDwvdGVtcGxhdGU+YCxcbiAgICBdLmpvaW4oJ1xcbicpXG5cbiAgICAvLyBwYXJzZSB0ZW1wbGF0ZSB3aXRoIHZ1ZSBzZmMgY29tcGlsZXJcbiAgICBjb25zdCByZXN1bHQgPSBwYXJzZShzZmMsIHtcbiAgICAgIGZpbGVuYW1lOiBwYXRoLFxuICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgIH0pXG5cbiAgICBpZiAocmVzdWx0LmVycm9ycy5sZW5ndGggfHwgcmVzdWx0LmRlc2NyaXB0b3IudGVtcGxhdGUgPT09IG51bGwpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9ycylcblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXJrZG93bjogdW5hYmxlIHRvIHBhcnNlIHZpcnR1YWwgZmlsZSBnZW5lcmF0ZWQgZm9yIFwiJHtpZH1cImApXG4gICAgfVxuXG4gICAgLy8gY29tcGlsZSB0ZW1wbGF0ZSB3aXRoIHZ1ZSBzZmMgY29tcGlsZXJcbiAgICBjb25zdCB7IGNvZGUsIGVycm9ycyB9ID0gY29tcGlsZVRlbXBsYXRlKHtcbiAgICAgIGZpbGVuYW1lOiBwYXRoLFxuICAgICAgaWQ6IHBhdGgsXG4gICAgICBzb3VyY2U6IHJlc3VsdC5kZXNjcmlwdG9yLnRlbXBsYXRlLmNvbnRlbnQsXG4gICAgICBwcmVwcm9jZXNzTGFuZzogcmVzdWx0LmRlc2NyaXB0b3IudGVtcGxhdGUubGFuZyxcbiAgICAgIHRyYW5zZm9ybUFzc2V0VXJsczogZmFsc2UsXG4gICAgfSlcblxuICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9ycylcblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXJrZG93bjogdW5hYmxlIHRvIGNvbXBpbGUgdmlydHVhbCBmaWxlIFwiJHtpZH1cImApXG4gICAgfVxuXG4gICAgLy8gc291cmNlIGlzIHVzZWQgdG8gZGlzcGxheSBlZGl0IHNvdXJjZSBsaW5rIGluIHRoZSBkb2NzXG4gICAgbGV0IHNvdXJjZU1ldGEgPSAndW5kZWZpbmVkJ1xuICAgIGlmIChvcHRpb25zLnNvdXJjZU1ldGE/LmVuYWJsZWQpIHtcbiAgICAgIHNvdXJjZU1ldGEgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHJlbGF0aXZlUGF0aDogcGF0aC5zdWJzdHJpbmcoY3dkLmxlbmd0aCksXG4gICAgICAgIGJhc2VuYW1lOiBiYXNlbmFtZShwYXRoKSxcbiAgICAgICAgcGF0aDogY29uZmlnPy5pc1Byb2R1Y3Rpb24gPyAnJyA6IHBhdGgsXG4gICAgICAgIGVkaXRQcm90b2NvbDogY29uZmlnPy5pc1Byb2R1Y3Rpb24gPyAnJyA6IG9wdGlvbnMuc291cmNlTWV0YS5lZGl0UHJvdG9jb2wsXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIGluamVjdCBmcm9udG1hdHRlci9kYXJrbW9kZSBhbmQgaG1ySWQgaW50byB0aGUgY29tcGlsZWQgcmVuZGVyIGZ1bmN0aW9uXG4gICAgY29uc3Qgb3V0cHV0ID0gW1xuICAgICAgYGltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ2AsXG4gICAgICBgaW1wb3J0IHsgdXNlRGFya21vZGUgfSBmcm9tICcvQHNyYy9zdG9yZXMvZGFya21vZGUnYCxcblxuICAgICAgY29kZS5yZXBsYWNlKCdleHBvcnQgZnVuY3Rpb24gcmVuZGVyJywgJ2Z1bmN0aW9uIHJlbmRlcicpLFxuXG4gICAgICBgY29uc3QgX19mcm9udG1hdHRlciA9ICR7SlNPTi5zdHJpbmdpZnkoZnJvbnRtYXR0ZXIpfTtgLFxuICAgICAgYGNvbnN0IHNldHVwID0gKCkgPT4gKHtgLFxuICAgICAgYCAgZnJvbnRtYXR0ZXI6IHJlYWN0aXZlKF9fZnJvbnRtYXR0ZXIpLGAsXG4gICAgICBgICBkYXJrbW9kZTogdXNlRGFya21vZGUoKSxgLFxuICAgICAgYCAgc291cmNlTWV0YTogJHtzb3VyY2VNZXRhfSxgLFxuICAgICAgYH0pO2AsXG4gICAgICBgY29uc3QgX19zY3JpcHQgPSB7IHJlbmRlciwgc2V0dXAgfTtgLFxuXG4gICAgICBjb25maWc/LmlzUHJvZHVjdGlvbiA/ICcnIDogYF9fc2NyaXB0Ll9faG1ySWQgPSAke0pTT04uc3RyaW5naWZ5KHBhdGgpfTtgLFxuICAgICAgYGV4cG9ydCBkZWZhdWx0IF9fc2NyaXB0O2AsXG4gICAgXS5qb2luKCdcXG4nKVxuXG4gICAgcmV0dXJuIG91dHB1dFxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZS1wbHVnaW4tdnVlcm8tZG9jJyxcbiAgICBlbmZvcmNlOiAncHJlJyxcbiAgICBjb25maWdSZXNvbHZlZChfY29uZmlnKSB7XG4gICAgICBjb25maWcgPSBfY29uZmlnXG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2Zvcm0ocmF3LCBpZCkge1xuICAgICAgaWYgKGlkLmVuZHNXaXRoKCcubWQnKSAmJiBpZC5zdGFydHNXaXRoKHBhdGhQcmVmaXgpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBtYXJrZG93blRvVnVlKGlkLCByYXcpXG4gICAgICB9XG4gICAgfSxcbiAgfSBzYXRpc2ZpZXMgUGx1Z2luXG59XG5cbmV4cG9ydCBkZWZhdWx0IFZpdGVQbHVnaW5WdWVyb0RvY1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLXBsdWdpbi12dWVyby1kb2MvbWFya2Rvd24udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLXBsdWdpbi12dWVyby1kb2MvbWFya2Rvd24udHNcIjtpbXBvcnQgeWFtbCBmcm9tICdqcy15YW1sJ1xuaW1wb3J0IHJlbWFya1NoaWtpIGZyb20gJ0BzdGVmYW5wcm9ic3QvcmVtYXJrLXNoaWtpJ1xuaW1wb3J0IHJlaHlwZUV4dGVybmFsTGlua3MgZnJvbSAncmVoeXBlLWV4dGVybmFsLWxpbmtzJ1xuaW1wb3J0IHJlaHlwZVJhdyBmcm9tICdyZWh5cGUtcmF3J1xuaW1wb3J0IHJlaHlwZVNsdWcgZnJvbSAncmVoeXBlLXNsdWcnXG5pbXBvcnQgcmVoeXBlQXV0b2xpbmtIZWFkaW5ncyBmcm9tICdyZWh5cGUtYXV0b2xpbmstaGVhZGluZ3MnXG5pbXBvcnQgcmVoeXBlU3RyaW5naWZ5IGZyb20gJ3JlaHlwZS1zdHJpbmdpZnknXG5pbXBvcnQgcmVtYXJrUGFyc2UgZnJvbSAncmVtYXJrLXBhcnNlJ1xuaW1wb3J0IHJlbWFya0dmbSBmcm9tICdyZW1hcmstZ2ZtJ1xuaW1wb3J0IHJlbWFya1JlaHlwZSBmcm9tICdyZW1hcmstcmVoeXBlJ1xuaW1wb3J0IHJlbWFya0Zyb250bWF0dGVyIGZyb20gJ3JlbWFyay1mcm9udG1hdHRlcidcbmltcG9ydCB7IGdldEhpZ2hsaWdodGVyLCB0eXBlIElUaGVtZVJlZ2lzdHJhdGlvbiwgdHlwZSBMYW5nLCB0eXBlIFRoZW1lIH0gZnJvbSAnc2hpa2knXG5pbXBvcnQgeyB1bmlmaWVkLCB0eXBlIFByb2Nlc3NvciB9IGZyb20gJ3VuaWZpZWQnXG5cbmNvbnN0IGxhbmdzID0gWyd2dWUnLCAndnVlLWh0bWwnLCAndHlwZXNjcmlwdCcsICdiYXNoJywgJ3Njc3MnXSBzYXRpc2ZpZXMgTGFuZ1tdXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQcm9jZXNzb3IodGhlbWU6IElUaGVtZVJlZ2lzdHJhdGlvbik6IFByb21pc2U8UHJvY2Vzc29yPiB7XG4gIGNvbnN0IGhpZ2hsaWdodGVyID0gYXdhaXQgZ2V0SGlnaGxpZ2h0ZXIoe1xuICAgIHRoZW1lLFxuICAgIGxhbmdzLFxuICB9KVxuXG4gIHJldHVybiB1bmlmaWVkKClcbiAgICAudXNlKHJlbWFya1BhcnNlKVxuICAgIC51c2UocmVtYXJrRnJvbnRtYXR0ZXIpXG4gICAgLnVzZSgoKSA9PiAodHJlZSwgZmlsZSkgPT4ge1xuICAgICAgaWYgKHRyZWUuY2hpbGRyZW5bMF0udHlwZSA9PT0gJ3lhbWwnKSB7XG4gICAgICAgIC8vIHN0b3JlIGZyb250bWF0dGVyIGluIHZmaWxlXG4gICAgICAgIGZpbGUuZGF0YS5mcm9udG1hdHRlciA9IHlhbWwubG9hZCh0cmVlLmNoaWxkcmVuWzBdLnZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgLnVzZShyZW1hcmtHZm0pXG4gICAgLnVzZShyZW1hcmtTaGlraSwgeyBoaWdobGlnaHRlciB9KVxuICAgIC51c2UocmVtYXJrUmVoeXBlLCB7IGFsbG93RGFuZ2Vyb3VzSHRtbDogdHJ1ZSB9KVxuICAgIC51c2UocmVoeXBlUmF3KVxuICAgIC51c2UocmVoeXBlRXh0ZXJuYWxMaW5rcywgeyByZWw6IFsnbm9mb2xsb3cnXSwgdGFyZ2V0OiAnX2JsYW5rJyB9KVxuICAgIC51c2UocmVoeXBlU2x1ZylcbiAgICAudXNlKHJlaHlwZUF1dG9saW5rSGVhZGluZ3MsIHtcbiAgICAgIGJlaGF2aW9yOiAnYXBwZW5kJyxcbiAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgdHlwZTogJ2VsZW1lbnQnLFxuICAgICAgICB0YWdOYW1lOiAnaScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBjbGFzc05hbWU6IFsnaWNvbmlmeSB0b2MtbGluay1hbmNob3InXSxcbiAgICAgICAgICBkYXRhSWNvbjogJ2ZlYXRoZXI6bGluaycsXG4gICAgICAgIH0sXG4gICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgIH0sXG4gICAgICB0ZXN0OiAobm9kZSkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgQXJyYXkuaXNBcnJheShub2RlLnByb3BlcnRpZXM/LmNsYXNzTmFtZSkgJiZcbiAgICAgICAgICBub2RlLnByb3BlcnRpZXM/LmNsYXNzTmFtZT8uaW5jbHVkZXMoJ3RvYy1pZ25vcmUnKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQm9vbGVhbihub2RlLnByb3BlcnRpZXM/LmlkKVxuICAgICAgfSxcbiAgICB9KVxuICAgIC51c2UocmVoeXBlU3RyaW5naWZ5KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHJvY2Vzc29ycyhcbiAgdGhlbWU6XG4gICAgfCBUaGVtZVxuICAgIHwge1xuICAgICAgICBsaWdodDogVGhlbWVcbiAgICAgICAgZGFyazogVGhlbWVcbiAgICAgIH1cbik6IFByb21pc2U8eyBsaWdodDogUHJvY2Vzc29yOyBkYXJrOiBQcm9jZXNzb3IgfT4ge1xuICByZXR1cm4ge1xuICAgIGxpZ2h0OiBhd2FpdCBjcmVhdGVQcm9jZXNzb3IodHlwZW9mIHRoZW1lID09PSAnc3RyaW5nJyA/IHRoZW1lIDogdGhlbWUubGlnaHQpLFxuICAgIGRhcms6IGF3YWl0IGNyZWF0ZVByb2Nlc3Nvcih0eXBlb2YgdGhlbWUgPT09ICdzdHJpbmcnID8gdGhlbWUgOiB0aGVtZS5kYXJrKSxcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rldi9NdXNpYy9OZXdGb2xkZXIvTXlXb3JrU3BhY2UvSWJleFdvcmtodWJQcm8vdml0ZS1wbHVnaW4tdnVlcm8tZG9jL3RyYW5zZm9ybS50c1wiO2ltcG9ydCB7IGtlYmFiQ2FzZSB9IGZyb20gJ3NjdWxlJ1xuXG5jb25zdCBTRUxGX0NMT1NJTkdfVEFHX1JFR0VYID0gLzwoW15cXHM+PC9dKykoW14+XSspXFwvPi9nXG5jb25zdCBPUEVOX1RBR19SRUdFWCA9IC88KFteXFxzPjwvXSspL2dcbmNvbnN0IENMT1NFX1RBR19SRUdFWCA9IC88XFwvKFteXFxzPjwvXSspL2dcblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybUV4YW1wbGVNYXJrdXAocmF3OiBzdHJpbmcpIHtcbiAgbGV0IG91dHB1dCA9IHJhd1xuICBsZXQgY29udGVudDogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGwgPSBudWxsXG4gIGlmICgoY29udGVudCA9IHJhdy5tYXRjaCgvPCEtLWV4YW1wbGUtLT4oW1xcc1xcU10qPyk8IS0tXFwvZXhhbXBsZS0tPi8pKSkge1xuICAgIGNvbnN0IGtlYmFiQ29udGVudCA9IGNvbnRlbnRbMV1cbiAgICAgIC5yZXBsYWNlQWxsKFNFTEZfQ0xPU0lOR19UQUdfUkVHRVgsIChzdWJzdHJpbmcsIHRhZykgPT4ge1xuICAgICAgICByZXR1cm4gc3Vic3RyaW5nLnJlcGxhY2UoJy8+JywgYD48LyR7dGFnLnRyaW0oKX0+YClcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZUFsbChPUEVOX1RBR19SRUdFWCwgKHN1YnN0cmluZykgPT4ge1xuICAgICAgICByZXR1cm4gYDwke2tlYmFiQ2FzZShzdWJzdHJpbmcuc3Vic3RyaW5nKDEpLnRyaW0oKSl9YFxuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlQWxsKENMT1NFX1RBR19SRUdFWCwgKHN1YnN0cmluZykgPT4ge1xuICAgICAgICByZXR1cm4gYDwvJHtrZWJhYkNhc2Uoc3Vic3RyaW5nLnN1YnN0cmluZygyKS50cmltKCkpfWBcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZUFsbCgnJiN4Mjc7JywgXCInXCIpXG5cbiAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShjb250ZW50WzFdLCBrZWJhYkNvbnRlbnQpXG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1TbG90cyhzb3VyY2U6IHN0cmluZywgY29uZGl0aW9uOiBzdHJpbmcgPSAnJykge1xuICBpZiAoc291cmNlLmluY2x1ZGVzKCc8IS0tY29kZS0tPicpICYmIHNvdXJjZS5pbmNsdWRlcygnPCEtLWV4YW1wbGUtLT4nKSkge1xuICAgIHJldHVybiBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZGVmYXVsdD4ke3NvdXJjZX1gXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS1jb2RlLS0+YCxcbiAgICAgICAgYDwvdGVtcGxhdGU+PHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjY29kZT5cXG48c2xvdCBuYW1lPVwiY29kZVwiPjxkaXYgdi1wcmU+YFxuICAgICAgKVxuICAgICAgLnJlcGxhY2UoYDwhLS0vY29kZS0tPmAsIGA8L2Rpdj48L3Nsb3Q+XFxuPC90ZW1wbGF0ZT5gKVxuICAgICAgLnJlcGxhY2UoXG4gICAgICAgIGA8IS0tZXhhbXBsZS0tPmAsXG4gICAgICAgIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNleGFtcGxlPlxcbjxzbG90IG5hbWU9XCJleGFtcGxlXCI+YFxuICAgICAgKVxuICAgICAgLnJlcGxhY2UoYDwhLS0vZXhhbXBsZS0tPmAsIGA8L3Nsb3Q+XFxuPC90ZW1wbGF0ZT5gKVxuICB9XG5cbiAgaWYgKHNvdXJjZS5pbmNsdWRlcygnPCEtLWNvZGUtLT4nKSkge1xuICAgIHJldHVybiBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZGVmYXVsdD4ke3NvdXJjZX1gXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS1jb2RlLS0+YCxcbiAgICAgICAgYDwvdGVtcGxhdGU+PHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjY29kZT5cXG48c2xvdCBuYW1lPVwiY29kZVwiPjxkaXYgdi1wcmU+YFxuICAgICAgKVxuICAgICAgLnJlcGxhY2UoXG4gICAgICAgIGA8IS0tL2NvZGUtLT5gLFxuICAgICAgICBgPC9kaXY+PC9zbG90PlxcbjwvdGVtcGxhdGU+XFxuPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZXhhbXBsZT48c2xvdCBuYW1lPVwiZXhhbXBsZVwiPjwvc2xvdD48L3RlbXBsYXRlPmBcbiAgICAgIClcbiAgfVxuXG4gIGlmIChzb3VyY2UuaW5jbHVkZXMoJzwhLS1leGFtcGxlLS0+JykpIHtcbiAgICByZXR1cm4gYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2RlZmF1bHQ+JHtzb3VyY2V9YFxuICAgICAgLnJlcGxhY2UoXG4gICAgICAgIGA8IS0tZXhhbXBsZS0tPmAsXG4gICAgICAgIGA8L3RlbXBsYXRlPjx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2V4YW1wbGU+XFxuPHNsb3QgbmFtZT1cImV4YW1wbGVcIj5gXG4gICAgICApXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS0vZXhhbXBsZS0tPmAsXG4gICAgICAgIGA8L3Nsb3Q+XFxuPC90ZW1wbGF0ZT5cXG48dGVtcGxhdGUgJHtjb25kaXRpb259ICNjb2RlPjxzbG90IG5hbWU9XCJjb2RlXCI+PC9zbG90PjwvdGVtcGxhdGU+YFxuICAgICAgKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZGVmYXVsdD4ke3NvdXJjZX08L3RlbXBsYXRlPmAgK1xuICAgIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNleGFtcGxlPjxzbG90IG5hbWU9XCJleGFtcGxlXCI+PC9zbG90PjwvdGVtcGxhdGU+YCArXG4gICAgYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2NvZGU+PHNsb3QgbmFtZT1cImNvZGVcIj48L3Nsb3Q+PC90ZW1wbGF0ZT5gXG4gIClcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLXBsdWdpbi1wdXJnZS1jb21tZW50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV2L011c2ljL05ld0ZvbGRlci9NeVdvcmtTcGFjZS9JYmV4V29ya2h1YlByby92aXRlLXBsdWdpbi1wdXJnZS1jb21tZW50cy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kZXYvTXVzaWMvTmV3Rm9sZGVyL015V29ya1NwYWNlL0liZXhXb3JraHViUHJvL3ZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IE1hZ2ljU3RyaW5nIGZyb20gJ21hZ2ljLXN0cmluZydcblxuZnVuY3Rpb24gcGFyc2VJZChpZDogc3RyaW5nKSB7XG4gIGNvbnN0IGluZGV4ID0gaWQuaW5kZXhPZignPycpXG4gIGlmIChpbmRleCA8IDApIHJldHVybiBpZFxuICBlbHNlIHJldHVybiBpZC5zbGljZSgwLCBpbmRleClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQbHVnaW5PcHRpb25zIHtcbiAgc291cmNlbWFwPzogYm9vbGVhblxufVxuXG4vKipcbiAqIFRoaXMgcGx1Z2luIHJlbW92ZXMgSFRNTCBjb21tZW50cyBmcm9tIHlvdXIgY29kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFZpdGVQbHVnaW5QdXJnZUNvbW1lbnRzKHsgc291cmNlbWFwID0gZmFsc2UgfTogUGx1Z2luT3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3B1cmdlLWNvbW1lbnRzJyxcbiAgICBlbmZvcmNlOiAncHJlJyxcbiAgICB0cmFuc2Zvcm06IChjb2RlLCBpZCkgPT4ge1xuICAgICAgY29uc3QgcGFyc2VkSWQgPSBwYXJzZUlkKGlkKVxuICAgICAgaWYgKFxuICAgICAgICAhKFxuICAgICAgICAgIHBhcnNlZElkLmVuZHNXaXRoKCcudnVlJykgfHxcbiAgICAgICAgICBwYXJzZWRJZC5lbmRzV2l0aCgnLmh0bWwnKSB8fFxuICAgICAgICAgIHBhcnNlZElkLmVuZHNXaXRoKCcuc3ZnJylcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgaWYgKCFjb2RlLmluY2x1ZGVzKCc8IS0tJykpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHMgPSBuZXcgTWFnaWNTdHJpbmcoY29kZSlcbiAgICAgIHMucmVwbGFjZSgvPCEtLVtcXHdcXFdcXHNdKj8tLT4vZywgJycpXG5cbiAgICAgIGlmIChzLmhhc0NoYW5nZWQoKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvZGU6IHMudG9TdHJpbmcoKSxcbiAgICAgICAgICBtYXA6IHNvdXJjZW1hcCAmJiAocy5nZW5lcmF0ZU1hcCh7IHNvdXJjZTogaWQsIGluY2x1ZGVDb250ZW50OiB0cnVlIH0pIGFzIGFueSksXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICB9IHNhdGlzZmllcyBQbHVnaW5cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFUsU0FBUyxTQUFTLGVBQWU7QUFDL1csU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZUFBZTtBQUN0QixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGFBQWE7QUFDcEIsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGNBQWM7QUFDckIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxtQ0FBbUM7OztBQ1o1QyxTQUFTLE1BQU0sZ0JBQWdCO0FBQy9CLFNBQVMsaUJBQWlCLGFBQWE7OztBQ0xtVyxPQUFPLFVBQVU7QUFDM1osT0FBTyxpQkFBaUI7QUFDeEIsT0FB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O0FBQUEsRUFFWCxVQUFVO0FBQUE7QUFBQSxFQUVWLFFBQVE7QUFBQTtBQUFBLElBRU4sTUFBTTtBQUFBLEVBQ1I7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFFBQVE7QUFBQTtBQUFBLElBRU4scUNBQXFDO0FBQUEsRUFDdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUUEsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQTtBQUFBLEVBRUY7QUFBQTtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWE7QUFBQSxNQUNmO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxF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
