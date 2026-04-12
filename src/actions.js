module.exports = function (self) {
	//Basic UDP send message
	//NOTE: The UDP message does **NOT** end in a CR/LF
	const sendUDPMessage = (msg, msgId = 'Sending UDP Message') => {
		if (msg === undefined) {
			self.log('warn', 'Message is undefined')
			return
		}

		if (self.udp) {
			//No matter what I try the debug message is never logged; change to info to see messages
			//Of the opinion this message is too verbose for info level logging
			self.log('debug', `${msgId}: ${msg}`)
			self.udp.send(msg)
		} else {
			self.log('warn', 'UDP not initialized')
		}
	}

	//Create a Toggle Action that is repeatable
	const createToggleAction = (name, cmdName = '') => {
		if (cmdName == '') {
			cmdName = name.toLowerCase()
		} else {
			cmdName = cmdName.toLowerCase()
		}

		const stateId = cmdName + 'State'

		return {
			name: name,
			options: [
				{
					type: 'dropdown',
					label: `${name} Control`,
					id: stateId,
					default: 'toggle',
					choices: [
						{ id: 'toggle', label: `Toggle ${name}` },
						{ id: 'on', label: `${name} On` },
						{ id: 'off', label: `${name} Off` },
					],
				},
			],
			callback: async (event, context) => {
				let opt = event.options
				let cmd = cmdName

				switch (opt[stateId]) {
					case 'on':
						cmd += ' 1'
						break
					case 'off':
						cmd += ' 0'
						break
				}

				sendUDPMessage(cmd, `${name} Command`)
			},
		}
	}

	self.setActionDefinitions({
		announcement: createToggleAction('Announcement'),
		compressor: createToggleAction('Compressor'),
		crossfade: createToggleAction('Crossfade'),
		defaultfade: createToggleAction('Default Fade', 'defaultfade'),
		equalizer: createToggleAction('Equalizer'),
		loop: createToggleAction('Loop'),
		pause: {
			name: 'Pause',
			options: [],
			callback: async (event) => {
				let cmd = 'pause'
				sendUDPMessage(cmd, 'Pause Command')
			},
		},
		play: {
			name: 'Play',
			options: [],
			callback: async (event) => {
				let cmd = 'play'
				sendUDPMessage(cmd, 'Play Command')
			},
		},
		playbutton: {
			name: 'Play Button',
			options: [
				{
					type: 'textinput',
					label: 'Button ID',
					id: 'buttonid',
				},
				{
					type: 'checkbox',
					label: 'Sound Over Sound',
					id: 'sos',
					default: false,
				},
			],
			callback: async (event, context) => {
				let opt = event.options
				let buttonId = await context.parseVariablesInString(opt.buttonid)
				let sos = opt.sos ? 1 : 0
				let cmd = `playbutton ${buttonId} ${sos}`

				sendUDPMessage(cmd, `Play Button ${buttonId} Command`)
			},
		},
		rewind: {
			name: 'Rewind',
			options: [],
			callback: async (event) => {
				let cmd = 'rewind'
				sendUDPMessage(cmd, 'Rewind Command')
			},
		},
      startPlaylist: {
			name: 'Start Playlist',
			options: [
				{
					type: 'number',
					label: 'Playlist ID (optional)',
					id: 'playlistid',
					default: null,
					min: 0,
					required: false,
				},
			],
			callback: async (event) => {
				let opt = event.options
				let cmd =
					opt.playlistid !== null && opt.playlistid !== undefined && opt.playlistid !== ''
						? `startplaylist ${parseInt(opt.playlistid)}`
						: 'startplaylist'
				sendUDPMessage(cmd, 'Start Playlist')
			},
		},
		stop: {
			name: 'Stop',
			options: [],
			callback: async (event) => {
				let cmd = 'stop'
				sendUDPMessage(cmd, 'Stop Command')
			},
		},
		stopall: {
			name: 'Stop All',
			options: [],
			callback: async (event) => {
				let cmd = 'stopall'
				sendUDPMessage(cmd, 'Stop All Command')
			},
		},
		stopplaylist: {
			name: 'Stop Playlist',
			options: [],
			callback: async (event) => {
				let cmd = 'stopplaylist'
				sendUDPMessage(cmd, 'Stop Playlist')
			},
		},
		volume: {
			name: 'Volume',
			options: [
				{
					type: 'number',
					label: 'Volume (0-100)',
					id: 'volumelvl',
					default: 50,
					min: 0,
					max: 100,
				},
			],
			callback: async (event, context) => {
				let opt = event.options
				let vol = opt.volumelvl
				let cmd = `volume ${vol}`

				sendUDPMessage(cmd, `Volume ${vol} Command`)
			},
		},
		volumedown: {
			name: 'Volume Down',
			options: [
				{
					type: 'number',
					label: 'Volume (0-10)',
					id: 'volumelvl',
					default: 5,
					min: 0,
					max: 10,
				},
			],
			callback: async (event, context) => {
				let opt = event.options
				let vol = opt.volumelvl
				let cmd = `volumedown ${vol}`

				sendUDPMessage(cmd, `Volume Down ${vol} Command`)
			},
		},
		volumeup: {
			name: 'Volume Up',
			options: [
				{
					type: 'number',
					label: 'Volume (0-10)',
					id: 'volumelvl',
					default: 5,
					min: 0,
					max: 10,
				},
			],
			callback: async (event, context) => {
				let opt = event.options
				let vol = opt.volumelvl
				let cmd = `volumeup ${vol}`

				sendUDPMessage(cmd, `Volume Up ${vol} Command`)
			},
		},
	})
}
