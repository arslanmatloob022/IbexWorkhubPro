<template>
  <div class="">
    <div class="section">
      <h3 class="title is-5">
        <BulletPill />
        Document folders
      </h3>
      <div class="mt-5">
        <label>
          <VControl class="is-flex align-items-ceneter">
            <VLabel raw class="remember-toggle">
              <VInput
                raw
                type="checkbox"
                :checked="!settings.documents.autoCreate"
              />

              <span class="toggler">
                <span class="active">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  ></i>
                </span>
                <span class="inactive">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:circle"
                  ></i>
                </span>
              </span>
            </VLabel>
            <h2 class="title is-6">
              Auto-create folders for subvendors and clients to upload documents
            </h2>
          </VControl>
        </label>
      </div>
      <div>
        <h3 class="title is-6 mt-6 mb-5">Default viewing permissions:</h3>
        <div class="columns is-multiline">
          <div class="column is-3">
            <label>
              <VControl class="is-flex align-items-ceneter">
                <VLabel raw class="remember-toggle">
                  <VInput
                    raw
                    type="checkbox"
                    :checked="!settings.documents.permissions.subVendors"
                  />

                  <span class="toggler">
                    <span class="active">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:check"
                      ></i>
                    </span>
                    <span class="inactive">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      ></i>
                    </span>
                  </span>
                </VLabel>
                <h2 class="title is-6">SubVendors</h2>
              </VControl>
            </label>
          </div>
          <div class="column is-3">
            <label>
              <VControl class="is-flex align-items-ceneter">
                <VLabel raw class="remember-toggle">
                  <VInput
                    raw
                    type="checkbox"
                    :checked="!settings.documents.permissions.clients"
                  />

                  <span class="toggler">
                    <span class="active">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:check"
                      ></i>
                    </span>
                    <span class="inactive">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      ></i>
                    </span>
                  </span>
                </VLabel>
                <h2 class="title is-6">Clients</h2>
              </VControl>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="title is-5">
        <BulletPill />
        Photo folders
      </h3>
      <div class="mt-5">
        <label>
          <VControl class="is-flex align-items-ceneter">
            <VLabel raw class="remember-toggle">
              <VInput
                raw
                type="checkbox"
                :checked="!settings.photos.autoCreate"
              />

              <span class="toggler">
                <span class="active">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:check"
                  ></i>
                </span>
                <span class="inactive">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:circle"
                  ></i>
                </span>
              </span>
            </VLabel>
            <h2 class="title is-6">
              Auto-create folder for clients to upload photos
            </h2>
          </VControl>
        </label>
      </div>
      <div class="columns is-multiline">
        <div class="column is-6">
          <h3 class="title is-6 mt-6 mb-5">Default viewing permissions:</h3>
          <div class="columns is-multiline">
            <div class="column is-6">
              <label>
                <VControl class="is-flex align-items-ceneter">
                  <VLabel raw class="remember-toggle">
                    <VInput
                      raw
                      type="checkbox"
                      :checked="!settings.photos.permissions.subVendors"
                    />

                    <span class="toggler">
                      <span class="active">
                        <i
                          aria-hidden="true"
                          class="iconify"
                          data-icon="feather:check"
                        ></i>
                      </span>
                      <span class="inactive">
                        <i
                          aria-hidden="true"
                          class="iconify"
                          data-icon="feather:circle"
                        ></i>
                      </span>
                    </span>
                  </VLabel>
                  <h2 class="title is-6">SubVendors</h2>
                </VControl>
              </label>
            </div>
            <div class="column is-6">
              <label>
                <VControl class="is-flex align-items-ceneter">
                  <VLabel raw class="remember-toggle">
                    <VInput
                      raw
                      type="checkbox"
                      :checked="!settings.photos.permissions.clients"
                    />

                    <span class="toggler">
                      <span class="active">
                        <i
                          aria-hidden="true"
                          class="iconify"
                          data-icon="feather:check"
                        ></i>
                      </span>
                      <span class="inactive">
                        <i
                          aria-hidden="true"
                          class="iconify"
                          data-icon="feather:circle"
                        ></i>
                      </span>
                    </span>
                  </VLabel>
                  <h2 class="title is-6">Clients</h2>
                </VControl>
              </label>
            </div>
          </div>
        </div>

        <div class="column is-6">
          <h3 class="title is-6 mt-6 mb-5">Default uploading permissions:</h3>
          <div class="columns is-multiline">
            <div class="column is-6">
              <label>
                <VControl class="is-flex align-items-ceneter">
                  <VLabel raw class="remember-toggle">
                    <VInput
                      raw
                      type="checkbox"
                      :checked="!settings.photos.permissions.subVendors"
                    />

                    <span class="toggler">
                      <span class="active">
                        <i
                          aria-hidden="true"
                          class="iconify"
                          data-icon="feather:check"
                        ></i>
                      </span>
                      <span class="inactive">
                        <i
                          aria-hidden="true"
                          class="iconify"
                          data-icon="feather:circle"
                        ></i>
                      </span>
                    </span>
                  </VLabel>
                  <h2 class="title is-6">SubVendors</h2>
                </VControl>
              </label>
            </div>
            <div class="column is-6">
              <label>
                <VControl class="is-flex align-items-ceneter">
                  <VLabel raw class="remember-toggle">
                    <VInput
                      raw
                      type="checkbox"
                      :checked="!settings.photos.permissions.clients"
                    />

                    <span class="toggler">
                      <span class="active">
                        <i
                          aria-hidden="true"
                          class="iconify"
                          data-icon="feather:check"
                        ></i>
                      </span>
                      <span class="inactive">
                        <i
                          aria-hidden="true"
                          class="iconify"
                          data-icon="feather:circle"
                        ></i>
                      </span>
                    </span>
                  </VLabel>
                  <h2 class="title is-6">Clients</h2>
                </VControl>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="title is-5">
        <BulletPill />
        Video folders
      </h3>

      <div>
        <h3 class="title is-6 mt-6 mb-5">Default viewing permissions:</h3>
        <div class="columns is-multiline">
          <div class="column is-3">
            <label>
              <VControl class="is-flex align-items-ceneter">
                <VLabel raw class="remember-toggle">
                  <VInput
                    raw
                    type="checkbox"
                    :checked="!settings.documents.permissions.subVendors"
                  />

                  <span class="toggler">
                    <span class="active">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:check"
                      ></i>
                    </span>
                    <span class="inactive">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      ></i>
                    </span>
                  </span>
                </VLabel>
                <h2 class="title is-6">SubVendors</h2>
              </VControl>
            </label>
          </div>
          <div class="column is-3">
            <label>
              <VControl class="is-flex align-items-ceneter">
                <VLabel raw class="remember-toggle">
                  <VInput
                    raw
                    type="checkbox"
                    :checked="!settings.documents.permissions.clients"
                  />

                  <span class="toggler">
                    <span class="active">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:check"
                      ></i>
                    </span>
                    <span class="inactive">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      ></i>
                    </span>
                  </span>
                </VLabel>
                <h2 class="title is-6">Clients</h2>
              </VControl>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

type Permissions = {
  subVendors: boolean;
  clients: boolean;
};

type Settings = {
  documents: {
    autoCreate: boolean;
    permissions: Permissions;
  };
  photos: {
    autoCreate: boolean;
    permissions: Permissions;
    uploading: Permissions;
  };
  videos: {
    permissions: Permissions;
  };
};

export default defineComponent({
  name: "FolderSettings",
  setup() {
    const settings = reactive<Settings>({
      documents: {
        autoCreate: false,
        permissions: {
          subVendors: false,
          clients: false,
        },
      },
      photos: {
        autoCreate: false,
        permissions: {
          subVendors: false,
          clients: false,
        },
        uploading: {
          subVendors: false,
          clients: false,
        },
      },
      videos: {
        permissions: {
          subVendors: false,
          clients: false,
        },
      },
    });

    const saveSettings = (): void => {
      console.log("Settings saved", settings);
      alert("Settings have been saved successfully!");
    };

    return {
      settings,
      saveSettings,
    };
  },
});
</script>

<style scoped lang="scss">
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
.section {
  margin-bottom: 30px;
  border: 1px solid #ddd;
  padding: 23px;
  border-radius: 12px;
  background-color: #ffffff;
}

.remember-toggle {
  width: 65px;
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  transform: scale(0.9);

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked ~ .toggler {
      border-color: var(--primary);

      .active,
      .inactive {
        transform: translateX(100%) rotate(360deg);
      }

      .active {
        opacity: 1;
      }

      .inactive {
        opacity: 0;
      }
    }
  }

  .toggler {
    position: relative;
    display: block;
    height: 34px;
    width: 61px;
    border: 2px solid var(--placeholder);
    border-radius: 100px;
    transition: all 0.3s; // transition-all test

    .active,
    .inactive {
      position: absolute;
      top: 2px;
      left: 2px;
      height: 26px;
      width: 26px;
      border-radius: var(--radius-rounded);
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translateX(0) rotate(0);
      transition: all 0.3s ease;

      svg {
        color: var(--white);
        height: 14px;
        width: 14px;
        stroke-width: 3px;
      }
    }

    .inactive {
      background: var(--placeholder);
      border-color: var(--placeholder);
      opacity: 1;
      z-index: 1;
    }

    .active {
      background: var(--primary);
      border-color: var(--primary);
      opacity: 0;
      z-index: 0;
    }
  }
}
</style>
