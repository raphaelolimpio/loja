import 'package:flutter/material.dart';
import 'package:loja/loja-service/cliente_service.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: ClientesScreen(),
    );
  }
}

class ClientesScreen extends StatefulWidget {
  @override
  _ClientesScreenState createState() => _ClientesScreenState();
}

class _ClientesScreenState extends State<ClientesScreen> {
  final ClienteService _clienteService = ClienteService();
  List _clientes = [];

  @override
  void initState() {
    super.initState();
    _loadClientes();
  }

  void _loadClientes() async {
    try {
      final clientes = await _clienteService.getClientes();
      setState(() {
        _clientes = clientes;
      });
    } catch (e) {
      print('Erro ao carregar clientes: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Clientes')),
      body: ListView.builder(
        itemCount: _clientes.length,
        itemBuilder: (context, index) {
          final cliente = _clientes[index];
          return ListTile(
            title: Text(cliente['nome']),
            subtitle: Text(cliente['email']),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _clienteService.addCliente({
            'nome': 'Novo Cliente',
            'email': 'novo@cliente.com',
            'senha': '12345',
            'telefone': '99999-9999',
            'endereco': 'Rua Exemplo, 123'
          });
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
