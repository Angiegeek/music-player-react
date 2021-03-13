import React, { useEffect, useState, useRef } from "react";

//create your first component
export function Home() {
	//FUNCIONALIDAD ENTERA
	//Fetching the array and storing it
	const [playlist, setPlaylist] = useState([]);
	useEffect(() => {
		songList();
	}, []);

	const songList = () => {
		fetch("https://assets.breatheco.de/apis/sound/songs")
			.then(response => response.json())
			.then(data => setPlaylist(data));
	};

	//Index state
	const [currentSong, setCurrentSong] = useState(0);

	//Button state
	const [playBtn, setBtn] = useState("play");

	//UseRef to call on <audio/> from MusicPlayer
	const audio = useRef();

	// Song functionality
	async function playSong() {
		audio.current.pause();

		audio.current.src =
			"https://assets.breatheco.de/apis/sound/" + currentSong.url;
		await audio.current.play();
		const newId = currentSong.id + 1;

		//.ended boolean tira false mientras da play, tira true cuando termina
		(await audio.current.ended) == true
			? setCurrentSong(playlist[newId])
			: "";
		console.log("Im the current song " + currentSong);
		setBtn("pause");
	}

	//Button functionality

	function toggleBtn() {
		playBtn == "play" ? setBtn("pause") : setBtn("play");
		playBtn == "play" ? audio.current.play() : audio.current.pause();
	}

	return (
		<>
			{/* Lista de canciones */}
			<div id="MusicPlayer">
				<table className="table table-striped table-hover table-dark text-white-50">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Title</th>
							<th scope="col">Category</th>
						</tr>
					</thead>
					<tbody>
						{playlist.length > 0 &&
							playlist.map((song, index) => {
								return (
									<tr
										key={song.id}
										onClick={() => {
											setCurrentSong({
												indice: index,
												...song
											});
											playSong();
										}}>
										<th scope="row">{index + 1}</th>
										<td>
											{song.name}
											<audio ref={audio} />
										</td>
										<td>{song.category || song.game}</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>

			{/* Barra de botones */}
			<div id="PlayBar">
				<div className="playBar d-flex justify-content-center">
					<div className="row p-2 align-items-center">
						<a
							onClick={() => {
								setCurrentSong({
									indice: parseInt(currentSong.indice) - 1,
									...playlist[
										parseInt(currentSong.indice) - 1
									]
								});
								playSong();
							}}>
							<i className="fas fa-step-backward"></i>
						</a>

						<i
							className={
								"fas " +
								(playBtn == "pause"
									? "fa-pause-circle"
									: "fa-play-circle")
							}
							onClick={() => {
								toggleBtn();
							}}
							role="button"></i>
						<a
							onClick={() => {
								setCurrentSong({
									indice: parseInt(currentSong.indice) + 1,
									...playlist[
										parseInt(currentSong.indice) + 1
									]
								});
								playSong();
							}}>
							<i className="fas fa-step-forward"></i>
						</a>
						{/* <i className="fas fa-headphones-alt"></i> */}
					</div>
				</div>
			</div>
			{/* <div style={{ color: "red" }}>{JSON.stringify(currentSong)}</div>
			<div style={{ color: "blue" }}>{JSON.stringify(playlist)}</div> */}
		</>
	);
}
