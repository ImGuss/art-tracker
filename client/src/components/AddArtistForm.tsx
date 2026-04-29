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
        <label htmlFor="add-artist-birth">Birth Year</label>
        <input
          type="number"
          id="add-artist-birth"
          name="birth_year"
        />

        <label htmlFor="add-artist-death">Death Year</label>
        <input
          type="number"
          id="add-artist-death"
          name="death_year"
        />
      </div>

      <label htmlFor="add-artist-birth-place">Birth Place</label>
      <input
        type="text"
        id="add-artist-birth-place"
        name="birth_place"
        placeholder="e.g. Paris, France"
      />

      <label htmlFor="add-artist-description">Description</label>
      <textarea name="description" id="add-artist-description"></textarea>

      <div className="modal-btn-container">
        <button className="gold-outline-btn">Cancel</button>
        <button className="gold-btn">Add Artist</button>
      </div>
    </form>
  )
}

export default AddArtistForm