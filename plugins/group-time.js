let handler = async (m, { conn, isAdmin, isOwner, args, usedPrefix, command }) => {
  if (!(isAdmin || isOwner)) {
	  global.dfail('admin', m, conn)
          throw false
  }
  let isClose = {
	  'open': 'not_announcement',
	  'tutup ': 'not_announcement',
      'on': 'not_announcement',
	  '1': 'not_announcement',
	  'close': 'announcement',
	  'buka ': 'announcement',
      'off': 'announcement',
      '0': 'announcement',
      ' ': 'announcement',
	
	  
     ' b': 'announcement',
     't': 'announcement',
  }[(args[0] || '')]
  if (isClose === undefined) {
	  let caption = `
Contoh:
*${usedPrefix + command} tutup*
*${usedPrefix + command} buka*

Contoh pilihan: *${usedPrefix + command} tutup 1* 
Maka grup akan di buka otomatis 1 jam kemudian.
`
      m.reply(caption)
	  throw false
  }
  let timeoutset = 86400000 * args[1] / 24
  await conn.groupSettingUpdate(m.chat, isClose).then(async _=> {
	  m.reply(`Sukses Mengubah setelan grup untuk mengizinkan hanya admin yang${isClose == 'announcement' ? 'dapat mengirim pesan ke' : 'agar semua peserta dapat mengirim pesan ke grup ini.'} grup ini.${args[1] ? `, grup akan dibuka setelah *${clockString(timeoutset)}*` : ''}`)
  })
  if (args[1]) {
	 setTimeout(async () => {
            await conn.groupSettingUpdate(m.chat, `${isClose == 'announcement' ? 'not_announcement' : 'announcement'}`).then(async _=>{
		    conn.reply(m.chat, `Grup telah di ${isClose == 'not_announcement' ? 'tutup, Mengubah setelan grup untuk mengizinkan hanya admin yang  dapat mengirim pesan ke grup ini pesan' : 'Mengubah setelan grup untuk mengizinkan agar semua peserta dapat mengirim pesan ke grup ini.'}!`)
	    })
        }, timeoutset)
  }
  }
handler.help = ['grouptime <open/close> <number>']
handler.tags = ['group']
handler.command = /^(grouptime|tutup|buka|b|t)$/i

handler.botAdmin = true
handler.group = true 

export default handler 

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}
