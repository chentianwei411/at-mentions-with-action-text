import { Controller } from "stimulus"
import Tribute from "tributejs"
import Trix from "trix"

export default class extends Controller {
  static targets = [ "field" ]

  connect() {
    this.editor = this.fieldTarget.editor
    // console.log(this.fieldTarget)
    // console.log(this.fieldTarget.editor)
    this.initializeTribute()
  }

  disconnect() {
    this.tribute.detach(this.fieldTarget)
  }

  initializeTribute() {
    this.tribute = new Tribute({
      allowSpaces: true,
      lookup: 'name',
      values: this.fetchUsers,
    })
    this.tribute.attach(this.fieldTarget)
    // 点击后回退一个字符，即去掉@：
    this.tribute.range.pasteHtml = this._pasteHtml.bind(this)
    // 给目标元素添加事件，当完成
    this.fieldTarget.addEventListener("tribute-replaced", this.replaced)
  }

  fetchUsers(text, callback) {
    fetch(`/mentions.json?query=${text}`)
      .then(response => response.json())
      .then(users => callback(users))
      .catch(error => callback([]))
  }

  replaced(e) {
    console.log(e)
    // 得到事件中的数据
    let mention = e.detail.item.original
    // 创建Trix.Attachment，然后调用insertAttachment方法来插入HTML
    let attachment = new Trix.Attachment({
      sgid: mention.sgid,
      content: mention.content
    })
    this.editor.insertAttachment(attachment)
    // 再插入一个空格，具体见Trix Api.
    this.editor.insertString(" ")
  }

  _pasteHtml(html, startPos, endPos) {
    let position = this.editor.getPosition()
    this.editor.setSelectedRange([position - endPos, position])
    this.editor.deleteInDirection("backward")
  }
}
