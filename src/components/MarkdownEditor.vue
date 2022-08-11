<template>
  <div ref="editor" :class="`markdown-editor ${fullscreen ? 'markdown-editor-full' : ''}`">
    <div class="topbar">
      <!-- 预览开关 -->
      <button class="btn" :title="showPreview ? '关闭预览' : '打开预览'" @click="showPreview = !showPreview">
        <svg v-show="showPreview" class="icon" aria-hidden="true">
          <use xlink:href="#icon-hide"></use>
        </svg>
        <svg v-show="!showPreview" class="icon" aria-hidden="true">
          <use xlink:href="#icon-show"></use>
        </svg>
      </button>
      <!-- 分隔线 -->
      <div class="divider"></div>
      <!-- 全屏显示开关 -->
      <button class="btn" :title="fullscreen ? '关闭全屏' : '开启全屏'" @click="fullscreen = !fullscreen">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-editor-fullscreen"></use>
        </svg>
      </button>
      <!-- 分隔线 -->
      <div class="divider"></div>
      <!-- 快捷输入 -->
      <button class="btn" title="表格" @click="addTable">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-table"></use>
        </svg>
      </button>
      <button class="btn" title="有序列表" @click="addOrderedList">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-list-order"></use>
        </svg>
      </button>
      <button class="btn" title="无序列表" @click="addUnOrderedList">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-list-disorder"></use>
        </svg>
      </button>
      <button class="btn" title="链接" @click="addLink">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-link"></use>
        </svg>
      </button>
      <button class="btn" title="代码块" @click="addCodeBlock">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-code-block"></use>
        </svg>
      </button>
      <!-- 分隔线 -->
      <div class="divider"></div>
      <!-- 标题 -->
      <div style="color: #555;">{{ title ? title : '未命名' }}.md</div>
    </div>
    <div ref="container" class="container">
      <textarea
        ref="textBox"
        spellcheck="false"
        :class="`text-box ${showPreview ? '' : 'text-box-full'}`"
        v-model="markdown.text"
        @keydown.tab="handleTabKeyDown"
      ></textarea>
      <div v-show="showPreview" ref="resizeLine" class="resize-line"></div>
      <div v-show="showPreview" class="html-box markdown-body" v-html="markdown.html"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { marked } from 'marked';
import 'github-markdown-css';
import '../assets/icon/editorIcon';

// 声明 props 和 emit
const { data } = defineProps({
  data: Object,
});
const emit = defineEmits(['dataChange']);

/**
 * ********** 基础功能 **********
 */
// 数据
const markdown = reactive({
  text: data && data.text ? data.text : '',
  html: '',
});

// 是否开启预览
const showPreview = ref(true);

// 是否开启全屏显示
const fullscreen = ref(false);

// 解析 markdown，并将text和html上传给父组件
markdown.html = computed(() => {
  const html = marked(markdown.text);
  emit('dataChange', {
    title: title.value ? title.value : '未命名',
    text: markdown.text,
    html
  });
  return html;
});

// 元素标识
const editor = ref(null); // 编辑器
const container = ref(null); // 包裹输入框和预览框的元素
const textBox = ref(null); // 输入框
const resizeLine = ref(null); // 调整输入框和预览框大小的元素

// 拖拽改变元素大小
const dragChangeElementSize = () => {
  // 在resizeLine元素上按下鼠标时触发
  resizeLine.value.onmousedown = function() {
    // 获取编辑器距离左侧窗口的距离
    const editorLeftPosition = editor.value.getBoundingClientRect().x;
    // 输入框最小宽度
    const textBoxMinWidth = 100 + editorLeftPosition;
    // 预览框最小宽度
    const htmlBoxMinWidth = 100 - editorLeftPosition;
    // 鼠标移动时获取移动的距离
    document.onmousemove = function(e) {
      let moveLen = 0;
      moveLen = e.clientX < textBoxMinWidth ? textBoxMinWidth : e.clientX;//设置左侧最小宽度
      moveLen = e.clientX > container.value.clientWidth - htmlBoxMinWidth ? container.value.clientWidth - htmlBoxMinWidth : moveLen;//设置右侧最小宽度
      textBox.value.style.flex = `0 0 ${moveLen - editorLeftPosition}px`;
    }
    // 松开鼠标，清除事件
    document.onmouseup = function() {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
}

// 关闭和打开全屏时重置textbox宽度，防止出现textbox宽度溢出的bug
watch(fullscreen, (newValue, oldValue) => {
  textBox.value.style.flex = '0 0 50%';
});

// 组件挂载后执行
onMounted(() => {
  dragChangeElementSize();
  textBox.value.focus();
});

/**
 * ********** 自动获取标题 **********
 */
// 获取标题
const title = computed(() => {
  let t = '';
  const list = markdown.text.split('\n');
  for (let i = 0; i < list.length; i++) {
    if (list[i][0] === '#' && list[i][1] === ' ') {
      t = list[i].replace(/#\s+/, '');
      return t;
    }
  }
});

/**
 * ********** 快捷输入 **********
 */
// 获取输入框中光标的位置
const getCursorPosition = () => {
  return {
    start: textBox.value.selectionStart,
    end: textBox.value.selectionEnd,
  }
}

// 插入文本
const insertText = async (text) => {
  const position = getCursorPosition();
  const left = markdown.text.slice(0, position.start);
  const right = markdown.text.slice(position.end, markdown.text.length);
  markdown.text = left + text + right;
  // 设置光标位置在刚插入的文本末尾
  /**
   * bug（具体原因未知）: v-model有延迟导致textBox.value.value与markdown.text在同一时间下值并不相同，这会使后面setSelectionRange代码无效
   * 临时解决方法（二选一）: 1、给setSelectionRange方法设置一个延时器   2、给setSelectionRange前面的代码添加一个await操作符
   */
  await textBox.value.focus();
  textBox.value.setSelectionRange(position.start + text.length, position.start + text.length);
}

// 添加表格
const addTable = () => {
  const thead = '\n|title1|title2|title3|\n|:-:|:-:|:-:|\n';
  const tbody = '|content|content|content|\n';
  const tableString = thead + tbody + tbody + tbody;
  insertText(tableString);
}

// 添加有序列表
const addOrderedList = () => {
  let listString = '\n';
  for (let i = 1; i <= 5; i++) {
    listString = listString + i + '. item' + i + '\n';
  }
  insertText(listString);
}

// 添加无需列表
const addUnOrderedList = () => {
  let listString = '\n';
  for (let i = 1; i <= 5; i++) {
    listString = listString + '- item' + i + '\n';
  }
  insertText(listString);
}

// 添加链接
const addLink = () => {
  const linkString = '[Markdown链接](https://markdown.com.cn)';
  insertText(linkString);
}

// 添加代码块
const addCodeBlock = () => {
  const codeBlockString = '\n\`\`\`javascript\nconsole.log(\'Hello world\');\n\`\`\`\n';
  insertText(codeBlockString);
}

/**
 * ********** 修复textarea中无法使用tab键的bug **********
 * 阻止tab键默认事件，替换为输入两个空格
 */
const handleTabKeyDown = (e) => {
  insertText('  ')
  e.preventDefault();
}
</script>

<style lang="scss">
.btn {
  height: 22px;
  border: none;
  border-radius: 3px;
  background: none;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
}

.icon {
  width: 20px;
  height: 20px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.markdown-editor-full {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 99;
}

.markdown-editor {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;

  .topbar {
    padding: 0 10px;
    height: 30px;
    // background: #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background: #fff;
    >.divider {
      margin: 0 10px;
      width: 1px;
      height: 100%;
      background: #ddd;
    }
  }

  .container {
    position: absolute;
    top: 30px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;

    >.text-box {
      flex: 0 0 50%;
      padding: 10px;
      box-sizing: border-box;
      border: none;
      outline: none;
      font-size: 14px;
      line-height: 21px;
      font-family: '华文细黑';
      resize: none;
      background: #f9f9f9;
      overflow-y: auto;
    }

    >.text-box-full {
      flex: 0 0 100% !important;
    }

    >.resize-line {
      flex: 0 0 5px;
      background: #ddd;
      user-select: none;
      cursor: col-resize;
    }

    >.html-box {
      flex: 1;
      padding: 20px;
      background: #fff;
      overflow-y: auto;
    }
  }
}
</style>
