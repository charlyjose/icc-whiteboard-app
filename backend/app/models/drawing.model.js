module.exports = mongoose => {
  const Todo = mongoose.model(
    "drawing",
    mongoose.Schema(
      {
        boardId: String,
        data: Array
      },
      { timestamps: true }
    )
  )
  return Todo
}