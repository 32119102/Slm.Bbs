<template>
  <div class="avatar-edit">
    <!-- <img :src="value" /> -->
    <div class="avatar-view" :style="{ backgroundImage: 'url(' + value + ')' }">
      <div class="upload-view" @click="pickImage">
        <i class="iconfont icon-upload" />
        <span>点击修改</span>
      </div>
    </div>

    <input
      ref="uploadImage"
      accept="image/*"
      type="file"
      @input="uploadAvatar"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    pickImage() {
      const currentObj = this.$refs.uploadImage
      currentObj.dispatchEvent(new MouseEvent('click'))
    },
    async uploadAvatar(e) {
      const files = e.target.files
      if (files.length <= 0) {
        return
      }
      try {
        // 上传头像
        const file = files[0]
        const formData = new FormData()
        formData.append('file', file, file.name)
        const ret = await this.$axios.post(
          '/api/file/blob-picture-save',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )

        // 设置头像
        await this.$axios.post('/api/user/set-user-avatar', {
          url: ret,
        })

        // 重新加载数据
        this.$emit('input', ret)
        this.$emit('success', ret)
      } catch (e) {
        console.error(e)
        this.$emit('error', e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-edit {
  .avatar-view {
    width: 120px;
    height: 120px;
    background-size: cover;
    background-color: var(--bg-color2);
    border-radius: 50%;
    position: relative;

    &:hover {
      .upload-view {
        visibility: visible;
      }
    }

    .upload-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: var(--text-color);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: var(--bg-color-alpha);
      visibility: hidden;
      cursor: pointer;

      span {
        font-size: 13px;
        font-weight: 500;
      }
    }
  }

  input[type='file'] {
    display: none;
  }
}
</style>
