import { app, BrowserWindow } from 'electron';
import { join } from 'path';

const createWindow = () =>
{
	const mainWindow = new BrowserWindow(
	{
		width			: 1920,
		height			: 1080,
		webPreferences	: { preload: join(__dirname, 'preload.js') }
	});

	mainWindow.loadFile('dist/index.html');
};

app.whenReady().then(() =>
{
	createWindow();
	app.on('activate', () =>
	{
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () =>
{
	if (process.platform !== 'darwin') app.quit();
});