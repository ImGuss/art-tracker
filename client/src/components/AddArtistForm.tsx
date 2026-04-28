const AddArtistForm = () => {
  return (
    <form
      className="modal-form"
    >
      <label htmlFor="add-artist-name">Title</label>
      <input
        type="text"
        id="add-artist-name"
        name="name"
        placeholder="e.g. Vincent van Gogh"
      />
      
      <div className="modal-dual-input">
        <label htmlFor="">Birth Year</label>
        <input type="date" />

        <label htmlFor="">Death Year</label>
        <input type="date" />
      </div>
    </form>
  )
}

export default AddArtistForm