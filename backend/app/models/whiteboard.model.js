module.exports = mongoose => {
  const Todo = mongoose.model(
    "whiteboard",
    mongoose.Schema(
      {
        boardId: String,
        createdBy: String,
        accessed: Array,
        data: Array
      },
      { timestamps: true }
    )
  )
  return Todo
}