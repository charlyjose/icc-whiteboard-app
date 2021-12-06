module.exports = mongoose => {
  const Todo = mongoose.model(
    "whiteboard",
    mongoose.Schema(
      {
        joinCode: String,
        creatorId: String,
        authorised: Array
      },
      { timestamps: true }
    )
  )
  return Todo
}