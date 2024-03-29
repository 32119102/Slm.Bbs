<template>
  <section class="main">
    <div class="container">
      <div class="topic-create-form">
        <h1 class="title">修改帖子</h1>

        <div class="field">
          <div class="control">
            <div
              v-for="node in nodes"
              :key="node.nodeId"
              class="tag"
              :class="{ selected: postForm.nodeId === node.nodeId }"
              @click="postForm.nodeId = node.nodeId"
            >
              <span>{{ node.name }}</span>
            </div>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <input
              v-model="postForm.title"
              class="input topic-title"
              type="text"
              placeholder="请输入帖子标题"
            />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <markdown-editor
              v-model="postForm.content"
              placeholder="可空，将图片复制或拖入编辑器可上传"
            />
            <div v-show="showImageUpload" class="simple-editor-image-upload">
              <image-upload
                ref="imageUploader"
                v-model="postForm.imageList"
                :on-upload.sync="imageUploading"
                @input="onImageUploadInput"
              />
            </div>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <tag-input v-model="postForm.tags" />
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <a
              :class="{ 'is-loading': publishing }"
              :disabled="publishing"
              class="button is-success"
              @click="submitCreate"
              >提交更改</a
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  middleware: 'authenticated',
  async asyncData({ $axios, params }) {
    const [topic, nodes] = await Promise.all([
      $axios.get('/api/topic/' + params.id),
      $axios.get('/api/topic/nodes'),
    ])
    return {
      topic,
      nodes,
      postForm: {
        nodeId: topic.nodeId,
        title: topic.title,
        tags: topic.tags.map((t) => {
          return t.tagName
        }),
        content: topic.content,
        imageList: topic.imageList,
      },
    }
  },
  data() {
    return {
      publishing: false, // 当前是否正处于发布中...
      showImageUpload: true,
      imageUploading: false,
      postForm: {
        nodeId: 0,
        title: '',
        tags: [],
        content: '',
        imageList: [],
      },
    }
  },
  head() {
    return {
      title: this.$siteTitle('修改话题'),
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user.current
    },
  },
  mounted() {},
  methods: {
    async submitCreate() {
      const me = this
      if (me.publishing) {
        return
      }
      me.publishing = true

      try {
        const topic = await this.$axios.put(
          '/api/topic/' + this.topic.topicId + '/update',
          {
            nodeId: this.postForm.nodeId,
            title: this.postForm.title,
            content: this.postForm.content,
            imageList:
              this.postForm.imageList && this.postForm.imageList.length
                ? JSON.stringify(this.postForm.imageList)
                : '',
            tags: this.postForm.tags ? this.postForm.tags.join(',') : '',
          }
        )
        this.$msg({
          message: '修改成功',
          onClose() {
            me.$linkTo('/topic/' + topic.topicId)
          },
        })
      } catch (e) {
        console.error(e)
        me.publishing = false
        // this.$message.error('提交失败：' + (e.message || e))
        this.$showErrorMsg(e.response.data.error)
      }
    },
    onImageUploadInput(value) {
      this.postForm.imageList = value
    },
  },
}
</script>

<style lang="scss" scoped>
.simple-editor-image-upload {
  // background: var(--bg-color2);
  padding: 20px 20px 20px;
}
</style>
